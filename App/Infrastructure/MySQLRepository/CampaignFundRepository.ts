import { ICampaignMediaRepositoryId } from '@domain/Core/CamapignMedia/ICampaignMediaRepository';
import { ICampaignMediaRepository } from '@domain/Core/CamapignMedia/ICampaignMediaRepository';
import models from '../Model';
import moment from 'moment';
import { IUserRepository, IUserRepositoryId } from '@domain/Core/User/IUserRepository';
import CampaignFund from '@domain/Core/CampaignFunds/CampaignFund';
import PaginationData from '@domain/Utils/PaginationData';
import { ChargeStatus } from '@domain/Core/ValueObjects/ChargeStatus';
import filterUndefined from '../Utils/filterUndefined';
import DatabaseError from '../Errors/DatabaseError';
import CampaignFundMap from '@domain/Core/CampaignFunds/CampaignFundMap';
import Campaign from '@domain/Core/Campaign/Campaign';
import { ICampaignFundRepository } from '@domain/Core/CampaignFunds/ICampaignFundRepository';
import { inject, injectable } from 'inversify';
import {
  ICampaignRepository,
  ICampaignRepositoryId,
} from '@domain/Core/Campaign/ICampaignRepository';
import {
  IHybridTransactionRepoistory,
  IHybridTransactionRepoistoryId,
} from '@domain/Core/HybridTransactions/IHybridTransactionRepository';
import {
  IEmployeeLogRepository,
  IEmployeeLogRepositoryId,
} from '@domain/Core/EmployeeLog/IEmployeeLogRepository';
import { CampaignEscrow } from '@domain/Core/ValueObjects/CampaignEscrow';
import {
  IIssuerRepository,
  IIssuerRepositoryId,
} from '@domain/Core/Issuer/IIssuerRepository';
import { CampaignStage } from '@domain/Core/ValueObjects/CampaignStage';

const {
  CampaignFundModel,
  ChargeModel,
  InvestorModel,
  CampaignModel,
  IssuerModel,
  UserModel,
  CampaignEscrowBankModel,
  CampaignOfferingChangeModel,
  InvestorBankModel,
  IssuerBankModel,
  Sequelize,
  sequelize,
  InvestorPaymentOptionModel,
  InvestorCardModel,
  CampaignMediaModel,
  CampaignPrincipleForgivenModel,
  HybridTransactionModel,
  EntityIntermediaryModel,
} = models;
const { Op, fn, col, literal } = Sequelize;

@injectable()
class CampaignFundRepository implements ICampaignFundRepository {
  constructor(
    @inject(IUserRepositoryId) private userRepository: IUserRepository,
    @inject(ICampaignRepositoryId) private campaignRepository: ICampaignRepository,
    @inject(ICampaignMediaRepositoryId)
    private campaignMediaRepository: ICampaignMediaRepository,
    @inject(IHybridTransactionRepoistoryId)
    private hybridTransaction: IHybridTransactionRepoistory,
    @inject(IEmployeeLogRepositoryId)
    private employeeLogRepository: IEmployeeLogRepository,
    @inject(IIssuerRepositoryId) private issuerRepository: IIssuerRepository,
  ) {}

  createPaginationResponse(paginationOptions, rows, count) {
    const paginationData = new PaginationData(paginationOptions, count);

    rows.forEach((row) => {
      paginationData.addItem(CampaignFundMap.toDomain(row));
    });

    return paginationData;
  }

  /**
   *
   * @param {CampaignFund} campaignFund
   */
  async add(campaignFund) {
    try {
      await CampaignFundModel.create(CampaignFundMap.toPersistence(campaignFund));
      return true;
    } catch (error) {
      throw new DatabaseError(error);
    }
  }

  /**
   * Fetch all campaignFunds from database with pagination
   * @returns CampaignFund[]
   * @param paginationOptions
   * @param showTrashed
   */
  async fetchAll(paginationOptions, showTrashed = 'false') {
    try {
      const includes = [
        {
          model: ChargeModel,
          as: 'charge',
          required: true,
        },
      ];

      const { rows, count } = await CampaignFundModel.findAndCountAll({
        include: includes,
        paranoid: !showTrashed,
        limit: paginationOptions.limit(),
        offset: paginationOptions.offset(),
      });

      return this.createPaginationResponse(paginationOptions, rows, count);
    } catch (e) {
      throw new DatabaseError(e);
    }
  }

  async fetchByCampaign(campaignId, paginationOptions, showTrashed = false, query) {
    try {
      const includes = [
        {
          model: ChargeModel,
          as: 'charge',
          required: true,
        },
        {
          model: HybridTransactionModel,
          as: 'campaignHybridTransactions',
        },
        {
          model: CampaignModel,
          as: 'campaign',
          attributes: ['campaignName'],
          include: {
            model: CampaignOfferingChangeModel,
            as: 'campaignOfferingChange',
            attributes: ['investorId', 'reconfirmed'],
          },
        },
        {
          model: InvestorModel,
          as: 'campaignInvestor',
          required: true,
          include: [
            {
              model: UserModel,
              as: 'user',
              required: true,
              attributes: [
                'firstName',
                'lastName',
                'email',
                'zipCode',
                'address',
                'city',
                'state',
              ],
              where: query
                ? {
                    [Op.or]: [
                      { firstName: { [Op.like]: `%${query}%` } },
                      { lastName: { [Op.like]: `%${query}%` } },
                      { email: { [Op.like]: `%${query}%` } },
                    ],
                  }
                : {},
            },
          ],
        },
      ];
      const { rows, count } = await CampaignFundModel.findAndCountAll({
        include: includes,
        paranoid: !showTrashed,
        limit: paginationOptions.limit(),
        offset: paginationOptions.offset(),
        where: {
          campaignId,
        },
        order: [[col('campaignFund.createdAt'), 'DESC']],
      });
      const paginationData = new PaginationData(paginationOptions, count);

      await Promise.all(
        rows.map(async (row) => {
          const campaignFund = CampaignFundMap.toDomain(row);

          const investmentsInThisCampaign = await CampaignFundModel.count({
            where: {
              campaignId: campaignId,
              investorId: campaignFund.InvestorId(),
            },
          });

          if (investmentsInThisCampaign > 1) {
            campaignFund.setRepeatInvestor('Existing');
          } else {
            const firstInvestmentInThisCampaign = await CampaignFundModel.findOne({
              where: {
                campaignId: campaignId,
                investorId: campaignFund.InvestorId(),
              },
              order: [['createdAt', 'ASC']],
            });

            if (firstInvestmentInThisCampaign) {
              const priorInvestments = await CampaignFundModel.findOne({
                where: {
                  investorId: campaignFund.InvestorId(),
                  campaignId: { [Op.ne]: campaignId },
                  createdAt: { [Op.lt]: firstInvestmentInThisCampaign.createdAt },
                },
              });

              campaignFund.setRepeatInvestor(priorInvestments ? 'Existing' : 'New');
            } else {
              campaignFund.setRepeatInvestor('New');
            }
          }

          campaignFund.setIncludeWallet(false);
          if (row.campaignHybridTransactions && row.campaignHybridTransactions.length) {
            campaignFund.setHybridTransaction(row.campaignHybridTransactions);
            campaignFund.setIncludeWallet(true);
          }
          paginationData.addItem(campaignFund);
        }),
      );
      return paginationData;
    } catch (e) {
      throw new DatabaseError(e);
    }
  }

  async fetchAllCampaignsInvestments(paginationOptions, showTrashed = false) {
    try {
      const includes = [
        {
          model: CampaignModel,
          as: 'campaign',
        },
      ];

      const { rows, count } = await CampaignFundModel.findAndCountAll({
        include: includes,
        where: {
          campaignId: {
            [Op.ne]: null,
          },
        },
        paranoid: !showTrashed,
      });

      const paginationData = [];

      rows.forEach((row) => {
        if (row.campaign)
          paginationData.push(CampaignFundMap.toCampaignsInvestmentReportDTO(row));
      });

      return paginationData;
    } catch (e) {
      throw new DatabaseError(e);
    }
  }

  async fetchSumInvestmentByCampaign(
    campaignId,
    investmentType = undefined,
    includePending = true,
  ) {
    try {
      const whereConditions = filterUndefined({
        campaignId,
        investmentType,
        chargeId: {
          [Op.not]: null,
        },
      });

      const chargeWhereConditions = {
        chargeStatus: {
          [Op.in]: includePending
            ? [ChargeStatus.SUCCESS, ChargeStatus.PENDING]
            : [ChargeStatus.SUCCESS],
        },
        [Op.and]: {
          refundRequestDate: { [Op.eq]: null },
          refunded: { [Op.or]: [null, false] },
        },
      };

      const chargeModelInclude = {
        model: ChargeModel,
        as: 'charge',
        required: true,
        where: chargeWhereConditions,
        attributes: [],
      };

      const sum = await CampaignFundModel.sum('campaignFund.amount', {
        where: whereConditions,
        include: [chargeModelInclude],
        // separate: true,
      });

      return sum || 0;
    } catch (e) {
      throw new DatabaseError(e);
    }
  }

  async fetchCountByCampaign(
    campaignId,
    countRefunded = false,
    distinctOnly = false,
    includePending = true,
  ) {
    try {
      const refundedFilter = countRefunded
        ? `refunded = 1`
        : `refundRequestDate is null and (refunded = 0 OR refunded IS NULL)`;
      const queryToDo = `SELECT count(${
        distinctOnly ? 'distinct ' : ''
      }investorId) AS investmentCount FROM charges
      inner join campaignFunds ON charges.chargeId = campaignFunds.chargeId
      where ${refundedFilter}
      AND campaignId = "${campaignId}"
      AND chargeStatus IN ${
        includePending
          ? `("${ChargeStatus.SUCCESS}","${ChargeStatus.PENDING}")`
          : `("${ChargeStatus.SUCCESS}")`
      };`;
      const results = await sequelize.query(queryToDo, {
        type: Sequelize.QueryTypes.SELECT,
      });

      return results[0].investmentCount || 0;
    } catch (e) {
      throw new DatabaseError(e);
    }
  }

  async fetchRefundRequestedCountByCampaign(campaignId) {
    try {
      const refundRequestedFilter = `refundRequestDate is not null and (refunded = 0 OR refunded IS NULL)`;
      const queryToDo = `SELECT count(*) AS investmentCount FROM charges
      inner join campaignFunds ON charges.chargeId = campaignFunds.chargeId
      where ${refundRequestedFilter}
      AND campaignId = "${campaignId}"
      AND chargeStatus IN ("${ChargeStatus.SUCCESS}","${ChargeStatus.PENDING}");`;
      const results = await sequelize.query(queryToDo, {
        type: Sequelize.QueryTypes.SELECT,
      });

      return results[0].investmentCount || 0;
    } catch (e) {
      throw new DatabaseError(e);
    }
  }

  async fetchSumByInvestorAndDate(investorId, date) {
    try {
      const chargeModelInclude = {
        model: ChargeModel,
        as: 'charge',
        required: true,
        where: {
          chargeStatus: {
            [Op.in]: [ChargeStatus.SUCCESS, ChargeStatus.PENDING],
          },
          [Op.and]: {
            refundRequestDate: { [Op.eq]: null },
            refunded: { [Op.or]: [null, false] },
          },
        },
        attributes: [],
      };

      const sum = await CampaignFundModel.sum('campaignFund.amount', {
        where: {
          investorId,
          createdAt: {
            [Op.gt]: date,
          },
        },
        include: [chargeModelInclude],
      });

      return sum || 0;
    } catch (e) {
      throw new DatabaseError(e);
    }
  }

  async fetchAllByCampaignWithSuccessfulCharges(campaignId) {
    try {
      const chargeModelInclude = {
        model: ChargeModel,
        as: 'charge',
        required: true,
        where: {
          chargeStatus: {
            [Op.in]: [ChargeStatus.SUCCESS, ChargeStatus.PENDING],
          },
          [Op.and]: {
            refundRequestDate: { [Op.eq]: null },
            refunded: { [Op.or]: [null, false] },
          },
        },
      };

      const all = await CampaignFundModel.findAll({
        where: { campaignId },
        include: [
          chargeModelInclude,
          {
            model: InvestorModel,
            as: 'campaignInvestor',
            attributes: ['investorId', 'userId'],
          },
        ],
      });

      return all.map((campaignFundObj) => CampaignFundMap.toDomain(campaignFundObj));
    } catch (e) {
      throw new DatabaseError(e);
    }
  }

  async fetchByInvestorAndDate(investorId, date) {
    try {
      const chargeModelInclude = {
        model: ChargeModel,
        as: 'charge',
        required: true,
        where: {
          chargeStatus: {
            [Op.in]: [ChargeStatus.SUCCESS, ChargeStatus.PENDING],
          },
          [Op.and]: {
            refundRequestDate: { [Op.eq]: null },
            refunded: { [Op.or]: [null, false] },
          },
        },
      };

      const all = await CampaignFundModel.findAll({
        where: {
          investorId,
          createdAt: {
            [Op.gt]: date,
          },
        },
        include: [chargeModelInclude],
      });

      return all.map((campaignFundObj) => CampaignFundMap.toDomain(campaignFundObj));
    } catch (e) {
      throw new DatabaseError(e);
    }
  }

  async fetchInvestorFundsOnly(investorId) {
    try {
      const chargeModelInclude = {
        model: ChargeModel,
        as: 'charge',
        required: true,
        where: {
          chargeStatus: {
            [Op.in]: [ChargeStatus.SUCCESS, ChargeStatus.PENDING],
          },
          [Op.and]: {
            refundRequestDate: { [Op.eq]: null },
            refunded: { [Op.or]: [null, false] },
          },
        },
      };
      const all = await CampaignFundModel.findAll({
        where: {
          investorId,
          entityId: null,
          deletedAt: null,
          createdAt: {
            [Op.gt]: `${moment().year() - 1}-${moment()
              .month('MM')
              .format('MM')}-${moment().date()}`,
          },
          chargeId: { [Op.ne]: null },
        },
        order: [['createdAt', 'ASC']],
        include: [chargeModelInclude],
      });
      return all.filter(
        (campaignFundObj) =>
          (campaignFundObj.charge.chargeStatus === ChargeStatus.SUCCESS ||
            campaignFundObj.charge.chargeStatus === ChargeStatus.PENDING) &&
          campaignFundObj.charge.refundRequestDate === null &&
          campaignFundObj.charge.deletedAt === null,
      );
    } catch (e) {
      throw new DatabaseError(e);
    }
  }

  async fetchAllByInvestor(investorId, completedOnly = false, entityId = null) {
    try {
      const chargeModelInclude = {
        model: ChargeModel,
        as: 'charge',
        required: true,
        where: {
          chargeStatus: {
            [Op.in]: completedOnly
              ? [ChargeStatus.SUCCESS]
              : [ChargeStatus.SUCCESS, ChargeStatus.PENDING],
          },
          [Op.and]: {
            refundRequestDate: { [Op.eq]: null },
            refunded: { [Op.or]: [null, false] },
          },
          '$campaignFund.investorId$': investorId,
          '$campaignFund.entityId$': entityId || null,
        },
      };

      const all = await CampaignFundModel.findAll({
        include: [
          {
            model: CampaignModel,
            as: 'campaign',
            include: [
              {
                model: IssuerModel,
                as: 'issuer',
              },
              {
                model: CampaignPrincipleForgivenModel,
                as: 'campaignPrincipleForgiven',
              },
            ],
          },
          chargeModelInclude,
        ],
      });
      return all.map((campaignFundObj) => {
        return CampaignFundMap.toDomain(campaignFundObj);
      });
    } catch (e) {
      throw new DatabaseError(e);
    }
  }

  async fetchAccumulatedInvestmentsByInvestor({ investorId }) {
    const campaignFundsQuery = `
        SELECT campaignFunds.amount as investedAmount, campaignFunds.createdAt as investedDate, campaigns.campaignName,
        campaigns.campaignId, campaigns.campaignStage, campaigns.annualInterestRate, campaigns.loanDuration
        FROM campaignFunds JOIN charges on campaignFunds.chargeId = charges.chargeId Inner Join campaigns
        on campaignFunds.campaignId = campaigns.campaignId where campaignFunds.investorId = "${investorId}"
         and charges.chargeId is not null and charges.refundRequestDate is null and campaigns.deletedAt is null;
      `;

    // const intrestPrincipleOutstandingQuery = `SELECT sum(r.principle) as principalReceived, sum(r.interest) as
    // intrestReceived, sum(cf.amount)-sum(r.principle) as outstandingBalance , sum(cf.amount) as totalAmountInvested,
    // r.campaignId from repayments r left join campaignFunds cf on r.campaignId = cf.campaignId
    // where r.investorId = "${investorId}" group by campaignId;`;

    // const nextPaymentsDateAndAmountQuery = `SELECT
    // pr.createdAt AS nextPaymentDate, sum(pr.principle + pr.interest) AS totalAmount
    // FROM
    //   investorPayments AS ip
    //   JOIN projectionReturns AS pr ON (ip.investorPaymentsId = pr.investorPaymentsId)
    // WHERE
    //   ip.investorId = '${investorId}'
    //   AND pr.createdAt > NOW()
    // group by pr.createdAt
    // ORDER BY
    //   pr.createdAt ASC
    // LIMIT 1;`;

    return sequelize.query(campaignFundsQuery, {
      type: Sequelize.QueryTypes.SELECT,
    });
    // const intrestPrincipleOutstanding = await sequelize.query(
    //   intrestPrincipleOutstandingQuery,
    //   { type: Sequelize.QueryTypes.SELECT },
    // );
    // const nextPaymentsDateAndAmount = await sequelize.query(
    //   nextPaymentsDateAndAmountQuery,
    //   { type: Sequelize.QueryTypes.SELECT },
    // );
    // return { campaignFunds, intrestPrincipleOutstanding, nextPaymentsDateAndAmount };
  }

  async fetchByInvestor(
    investorId,
    paginationOptions,
    showTrashed = false,
    includePending = false,
    includeFailed = false,
    includeRefunded = false,
    entityId = null,
  ) {
    try {
      let chargeWhereConditions = {};
      let chargeStatusToInclude = [ChargeStatus.SUCCESS];

      if (includePending) {
        chargeStatusToInclude.push(ChargeStatus.PENDING);
      }

      if (includeFailed) {
        chargeStatusToInclude.push(ChargeStatus.FAILED);
      }

      chargeWhereConditions = {
        chargeStatus: {
          [Op.in]: chargeStatusToInclude,
        },
      };

      if (!includeRefunded) {
        chargeWhereConditions = {
          ...chargeWhereConditions,
          [Op.and]: {
            refundRequestDate: { [Op.eq]: null },
            refunded: { [Op.or]: [null, false] },
            chargeStatus: { [Op.ne]: [ChargeStatus.CANCELLED] },
          },
        };
      }

      const chargeModelInclude = {
        model: ChargeModel,
        as: 'charge',
        required: true,
        where: chargeWhereConditions,
      };

      const includes = [
        {
          model: CampaignModel,
          as: 'campaign',
          attributes: [
            'campaignId',
            'campaignName',
            'annualInterestRate',
            'loanDuration',
            'campaignStage',
          ],
          include: [
            {
              model: IssuerModel,
              as: 'issuer',
            },
            {
              model: CampaignMediaModel,
            },
          ],
        },
        chargeModelInclude,
      ];
      const fundsWhere = {
        investorId,
        chargeId: {
          [Op.not]: null,
        },
      };
      if (entityId) {
        fundsWhere['entityId'] = entityId;
      }
      const { rows, count } = await CampaignFundModel.findAndCountAll({
        where: fundsWhere,
        include: includes,
        paranoid: !showTrashed,
        limit: paginationOptions.limit(),
        offset: paginationOptions.offset(),
        order: [
          [
            literal(
              `CASE WHEN campaign.campaignStage = '${CampaignStage.NOT_FUNDED}' THEN 0 ELSE 1 END`,
            ),
            'DESC',
          ],
          [col('campaign.campaignExpirationDate'), 'DESC'],
        ],
      });

      const paginationData = new PaginationData(paginationOptions, count);
      await Promise.all(
        rows.map(async (row) => {
          const campaignFund = CampaignFundMap.toDomain(row);
          campaignFund.setIncludeWallet(false);
          const hybridTransactions = await this.hybridTransaction.fetchAllByCampaignFundId(
            campaignFund.campaignFundId,
          );
          if (hybridTransactions.length > 0) {
            campaignFund.setHybridTransaction(hybridTransactions);
            campaignFund.setIncludeWallet(true);
          }

          paginationData.addItem(campaignFund);
        }),
      );
      console.log('paginatedData: ', paginationData);

      return paginationData;
    } catch (e) {
      throw new DatabaseError(e);
    }
  }
  async countInvestorInvestments(investorId) {
    const [
      { count },
    ] = await sequelize.query(
      `select count(*) as count from campaignFunds cf join charges ch on ch.chargeId = cf.chargeId where cf.investorId = '${investorId}' and cf.deletedAt is null and ch.refunded is null`,
      { type: Sequelize.QueryTypes.SELECT },
    );
    return count;
  }
  async countInvestorInvestmentsByCampaign(investorId, campaignId) {
    const [
      { count },
    ] = await sequelize.query(
      `select count(*) as count from campaignFunds cf join charges ch on ch.chargeId = cf.chargeId where cf.investorId = '${investorId}' and cf.campaignId = '${campaignId}' and cf.deletedAt is null and ch.refunded is null`,
      { type: Sequelize.QueryTypes.SELECT },
    );
    return count;
  }

  async countPromotionCreditsInvesments(investorId: string) {
    const count = await CampaignFundModel.count({
      where: {
        investorId,
        promotionCredits: {
          [Op.not]: null,
        },
        deletedAt: null,
      },
    });
    return count;
  }

  async fetchByInvestorAndGroupByCampaignId({
    investorId,
    paginationOptions,
    showTrashed = false,
    includePending = false,
    entityId = null,
    isAdminRequest = false,
  }) {
    try {
      let chargeWhereConditions = {
        refundRequestDate: { [Op.eq]: null },
        refunded: { [Op.or]: [null, false] },
        chargeStatus: { [Op.ne]: [ChargeStatus.CANCELLED] },
        '$campaignFund.investorId$': investorId,
        '$campaignFund.chargeId$': { [Op.not]: null },
      };
      if (entityId) {
        chargeWhereConditions['$campaignFund.entityId$'] = entityId;
      } else {
        chargeWhereConditions['$campaignFund.entityId$'] = null;
      }

      const adminChargeWhereCondition = {
        '$campaignFund.investorId$': investorId,
        '$campaignFund.chargeId$': { [Op.not]: null },
      };
      const includes = [
        {
          model: CampaignModel,
          as: 'campaign',
          include: [
            {
              model: IssuerModel,
              as: 'issuer',
            },
          ],
        },
        {
          model: ChargeModel,
          as: 'charge',
          where: !isAdminRequest ? chargeWhereConditions : adminChargeWhereCondition,
          attributes: [],
        },
      ];

      const { rows, count } = await CampaignFundModel.findAndCountAll({
        include: includes,
        paranoid: !showTrashed,
        limit: paginationOptions.limit(),
        offset: paginationOptions.offset(),
        raw: true,
        attributes: [
          'campaignId',
          [fn('sum', col('campaignFund.amount')), 'sumAmount'],
          [fn('max', col('campaignFund.createdAt')), 'createdAt'],
          [
            literal(
              "CASE WHEN MAX(`campaignFund`.`entityId`) IS NOT NULL THEN 'Entity' ELSE 'Individual' END",
            ),
            'investmentType',
          ],
        ],
        group: ['campaignId', col('campaignFund.createdAt')],
        order: [[col('campaignFund.createdAt'), 'DESC']],
        subQuery: false,
        separate: true,
        nest: true,
      });
      // const count: number = await this.countInvestorInvestments(investorId);
      const paginationData = new PaginationData(paginationOptions, count.length);
      await Promise.all(
        rows.map(async (row) => {
          row.campaign = Campaign.createFromObject(row.campaign);
          row.campaign.amount = row.sumAmount;
          if (!isAdminRequest) {
            const [campaignMedia, pendingCharges] = await Promise.all([
              this.campaignMediaRepository.fetchAllByCampaignId(row.campaign.campaignId),
              this.hasInvestmentByCriteria({
                investorId,
                campaignId: row.campaign.campaignId,
                chargeStatus: ChargeStatus.PENDING,
              }),
            ]);
            row.campaign.campaignMedia = campaignMedia;
            row.hasPendingCharges = pendingCharges;
          }
          return paginationData.addItem(row);
        }),
      );
      console.log('paginationData: ', paginationData);

      return paginationData;
    } catch (e) {
      throw new DatabaseError(e);
    }
  }

  async fetchByInvestorAndCampaignId({
    investorId,
    paginationOptions,
    showTrashed = false,
    entityId = null,
  }) {
    try {
      let chargeWhereConditions = {
        refundRequestDate: { [Op.eq]: null },
        refunded: { [Op.or]: [null, false] },
        chargeStatus: {
          [Op.or]: [ChargeStatus.PENDING, ChargeStatus.SUCCESS],
        },
        '$campaignFund.investorId$': investorId,
        '$campaignFund.chargeId$': { [Op.not]: null },
      };
      if (entityId) {
        chargeWhereConditions['$campaignFund.entityId$'] = entityId;
      } else {
        chargeWhereConditions['$campaignFund.entityId$'] = null;
      }

      const includes = [
        {
          model: CampaignModel,
          as: 'campaign',
          include: [
            {
              model: IssuerModel,
              as: 'issuer',
            },
          ],
        },
        {
          model: ChargeModel,
          as: 'charge',
          where: chargeWhereConditions,
          attributes: [],
        },
      ];

      const { rows, count } = await CampaignFundModel.findAndCountAll({
        where: { investorId },
        include: includes,
        paranoid: !showTrashed,
        limit: paginationOptions.limit(),
        offset: paginationOptions.offset(),
        raw: true,
        attributes: ['campaignId', [fn('sum', col('campaignFund.amount')), 'sumAmount']],
        group: ['campaignId'],
        order: [
          [
            literal(
              `CASE WHEN campaign.campaignStage = '${CampaignStage.NOT_FUNDED}' THEN 0 ELSE 1 END`,
            ),
            'DESC',
          ],
          [col('campaign.campaignExpirationDate'), 'DESC'],
        ],
        subQuery: false,
        separate: true,
        nest: true,
      });
      const paginationData = new PaginationData(paginationOptions, count.length);
      await Promise.all(
        rows.map(async (row) => {
          row.campaign = Campaign.createFromObject(row.campaign);
          row.campaign.amount = row.sumAmount;
          const [campaignMedia, pendingCharges] = await Promise.all([
            this.campaignMediaRepository.fetchAllByCampaignId(row.campaign.campaignId),
            this.hasInvestmentByCriteria({
              investorId,
              campaignId: row.campaign.campaignId,
              chargeStatus: ChargeStatus.PENDING,
            }),
          ]);
          row.campaign.campaignMedia = campaignMedia;
          row.hasPendingCharges = pendingCharges;
          return paginationData.addItem(row);
        }),
      );

      return paginationData;
    } catch (e) {
      throw new DatabaseError(e);
    }
  }

  /**
      @returns {Promise<boolean>}
   */
  async hasInvestmentByCriteria({
    investorId,
    campaignId,
    chargeStatus = undefined,
    showTrashed = false,
  }: any) {
    const hasInvestment = await CampaignFundModel.findOne({
      include: [
        {
          model: ChargeModel,
          as: 'charge',
          required: true,
          where: {
            chargeStatus: {
              [Op.in]: chargeStatus
                ? [chargeStatus]
                : [ChargeStatus.SUCCESS, ChargeStatus.PENDING],
            },
          },
          attributes: [],
        },
      ],
      paranoid: !showTrashed,
      where: {
        investorId,
        campaignId,
      },
    });

    return !!hasInvestment;
  }

  async fetchByCampaignAndGroupByInvestorId({
    campaignId,
    paginationOptions,
    showTrashed = false,
    includePending = false,
    query = '',
  }) {
    try {
      const campaign = await this.campaignRepository.fetchById(campaignId, true);

      if (!campaign) {
        throw new DatabaseError('no such campaign');
      }

      const sql = `
      select campaignFunds.investorId,sum(campaignFunds.amount) as amount,count(*) as count from campaignFunds
      inner join charges on campaignFunds.chargeId = charges.chargeId
              and (charges.refunded is null or charges.refunded is false)
              and charges.chargeStatus in (${
                includePending ? '"success","pending"' : '"success"'
              })
      inner join investors on campaignFunds.investorId = investors.investorId
        inner join users on investors.userId = users.userId
             and concat(firstName,lastName,email) like "%${query}%"
       where campaignId="${campaignId}" ${
        showTrashed ? '' : 'and campaignFunds.deletedAt is null'
      } group by investorId
       limit ${paginationOptions.limit()} offset ${paginationOptions.offset()};
      `;

      const result = await sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT });

      const investorDetailsPromises = result.map((row) => {
        return this.userRepository.fetchByInvestorId(row.investorId);
      });
      const investorDetails = await Promise.all(investorDetailsPromises);
      investorDetails.forEach((investorDetails, index) => {
        const { investor, ...user }: any = investorDetails;
        result[index].campaignInvestor = investor;
        result[index].campaignInvestor.user = user;
        result[index].campaign = campaign;
        result[index].campaignId = campaign.campaignId;
      });

      const paginationData = new PaginationData(paginationOptions, result.count);

      result.forEach((campaignFundObj) => {
        paginationData.addItem(CampaignFundMap.toDomain(campaignFundObj));
      });

      return paginationData;
    } catch (e) {
      throw new DatabaseError(e);
    }
  }

  async fetchByInvestorIdAndCampaignId(investorId, campaignId, findDeleted = false) {
    try {
      const fundObj = await CampaignFundModel.findOne({
        where: {
          investorId,
          campaignId,
        },
        include: [
          {
            model: ChargeModel,
            as: 'charge',
            required: true,
          },
        ],
      });

      if (!fundObj) {
        return false;
      }

      return CampaignFundMap.toDomain(fundObj);
    } catch (e) {
      throw new DatabaseError(e);
    }
  }

  /**
   * fetchById(campaignFundId) fetch campaignFund By Id
   * @param {string} campaignFundId
   * @returns CampaignFund
   */
  async fetchById(campaignFundId) {
    const includes = [
      {
        model: ChargeModel,
        as: 'charge',
        required: true,
        paranoid: false,
      },
      {
        model: HybridTransactionModel,
        as: 'campaignHybridTransactions',
      },
    ];

    const fundObj = await CampaignFundModel.findOne({
      where: {
        campaignFundId,
      },
      paranoid: false,
      include: includes,
    });

    if (!fundObj) {
      return false;
    }
    const fund = CampaignFundMap.toDomain(fundObj);
    const hybridTransactions = await this.hybridTransaction.fetchAllByCampaignFundId(
      fund.campaignFundId,
    );

    if (hybridTransactions.length > 0) {
      fund.setHybridTransaction(hybridTransactions);
      fund.setIncludeWallet(true);
    } else {
      fund.setIncludeWallet(false);
    }

    return fund;
  }

  async fetchInvestorSum(investorId, investmentType = undefined) {
    try {
      const whereConditions = filterUndefined({
        investorId,
        investmentType,
      });

      const chargeModelInclude = {
        model: ChargeModel,
        as: 'charge',
        required: true,
        where: {
          chargeStatus: {
            [Op.in]: [ChargeStatus.SUCCESS, ChargeStatus.PENDING],
          },
          [Op.and]: {
            refundRequestDate: { [Op.eq]: null },
            refunded: { [Op.or]: [null, false] },
          },
        },
        attributes: [],
      };

      const sum = await CampaignFundModel.sum('campaignFund.amount', {
        where: whereConditions,
        include: [chargeModelInclude],
      });

      return sum || 0;
    } catch (e) {
      throw new DatabaseError(e);
    }
  }

  async fetchReport(startDate, endDate, campaignId) {
    try {
      startDate = moment(startDate).startOf('day').format('YYYY-MM-DD HH:mm:ss');
      endDate = moment(endDate).endOf('day').format('YYYY-MM-DD HH:mm:ss');

      const whereConditions = filterUndefined({
        where: literal(`((campaignFund.createdAt between '${startDate}' and '${endDate}')
        )
         and campaignFund.campaignId = '${campaignId}'`),
      });

      const all = await CampaignFundModel.findAll({
        where: whereConditions,
        nest: true,
        raw: true,
        include: [
          {
            model: ChargeModel,
            as: 'charge',
            required: true,
            where: {
              refundRequestDate: {
                [Op.or]: [{ [Op.between]: [startDate, endDate] }, null],
              },
            },
          },
          {
            model: CampaignModel,
            as: 'campaign',
            attributes: ['campaignName'],
          },
          {
            model: InvestorModel,
            as: 'campaignInvestor',
            paranoid: false,
            required: true,
            order: [[{ model: UserModel }, 'createdAt', 'desc']],
            include: [
              {
                model: UserModel,
                as: 'user',
                required: true,
                attributes: ['firstName', 'lastName', 'email'],
                paranoid: false,
              },
            ],
          },
        ],
      });

      return all;
    } catch (e) {
      throw new DatabaseError(e);
    }
  }

  async fetchMultipleCampaignsReport(
    startDate,
    endDate,
    campaignNames,
    campaignStatuses,
  ) {
    try {
      startDate = moment(startDate).startOf('day').format('YYYY-MM-DD HH:mm:ss');
      endDate = moment(endDate).endOf('day').format('YYYY-MM-DD HH:mm:ss');
      let whereConditions = {};
      if (campaignNames.length && campaignStatuses.length) {
        whereConditions = {
          '$campaign.campaignName$': { [Op.in]: campaignNames },
          '$campaign.campaignStage$': { [Op.in]: campaignStatuses },
          '$campaign.escrowType$': { [Op.ne]: 'NCBank' },
          '$campaignFund.createdAt$': { [Op.between]: [startDate, endDate] },
        };
      } else if (campaignNames.length) {
        whereConditions = {
          '$campaign.campaignName$': { [Op.in]: campaignNames },
          '$campaign.escrowType$': { [Op.ne]: 'NCBank' },
          '$campaignFund.createdAt$': { [Op.between]: [startDate, endDate] },
        };
      } else if (campaignStatuses.length) {
        whereConditions = {
          '$campaign.campaignStage$': { [Op.in]: campaignStatuses },
          '$campaign.escrowType$': { [Op.ne]: 'NCBank' },
          '$campaignFund.createdAt$': { [Op.between]: [startDate, endDate] },
        };
      }
      const all = await CampaignFundModel.findAll({
        include: [
          {
            model: HybridTransactionModel,
            as: 'campaignHybridTransactions',
            required: true,
            where: {
              status: {
                [Op.in]: [
                  ChargeStatus.SUCCESS,
                  ChargeStatus.PENDING,
                  ChargeStatus.FAILED,
                  ChargeStatus.CANCELLED,
                  ChargeStatus.PENDING_REFUND,
                  ChargeStatus.REFUND_APPROVED,
                  ChargeStatus.REFUND_FAILED,
                  ChargeStatus.REFUND_PROCESSING,
                  ChargeStatus.REFUNDED,
                  ChargeStatus.CANCELATION_PENDING,
                ],
              },
            },
          },
          {
            model: CampaignModel,
            as: 'campaign',
            attributes: ['campaignName', 'campaignId', 'escrowType', 'campaignStage'],
          },
          {
            model: InvestorModel,
            as: 'campaignInvestor',
            paranoid: false,
            required: true,
            order: [[{ model: InvestorPaymentOptionModel }, 'createdAt', 'desc']],
            include: [
              {
                model: UserModel,
                as: 'user',
                required: true,
                attributes: ['firstName', 'lastName', 'email'],
                paranoid: false,
              },
            ],
          },
        ],
        where: whereConditions,
        nest: true,
        raw: true,
      });
      return Promise.all(
        all.map(async (item) => {
          if (item.campaignInvestor && item.campaignInvestor.investorBanks) {
            item.casmpaignInvestor.investorBanks.forEach((item) => item.decrypt());
          }
          item.entity = 'N/A';
          if (item.entityId) {
            const entity = await this.issuerRepository.fetchById(item.entityId);
            item.entity = entity.IssuerName();
          }

          return item;
        }),
      );
    } catch (e) {
      throw new DatabaseError(e);
    }
  }

  /**
   *
   * @param {CampaignFund} campaignFund
   */
  async update(campaignFund) {
    try {
      await CampaignFundModel.update(CampaignFundMap.toPersistence(campaignFund), {
        where: {
          campaignFundId: campaignFund.CampaignFundId(),
        },
      });
      return true;
    } catch (error) {
      throw Error(error);
    }
  }

  async updateWefunder(campaignFund) {
    const updateWefunderAmount = `UPDATE campaignFunds
    SET amount = ${campaignFund.amount}
    WHERE campaignFundId = '${campaignFund.campaignFundId}';`;
    return sequelize.query(updateWefunderAmount, {
      type: Sequelize.QueryTypes.UPDATE,
    });
  }

  /**
   *
   * @param {CampaignFund} campaignFund
   * @param {Boolean} hardDelete
   */
  async remove(campaignFund?: CampaignFund, hardDelete?: boolean) {
    try {
      await CampaignFundModel.destroy({
        where: {
          campaignFundId: campaignFund!.CampaignFundId(),
        },
        force: hardDelete,
      });

      return true;
    } catch (error) {
      throw Error(error);
    }
  }

  async fetchByChargeId(chargeId) {
    const fundObj = await CampaignFundModel.findOne({
      include: [
        {
          model: ChargeModel,
          as: 'charge',
          where: {
            chargeId,
          },
          required: true,
        },
        {
          model: InvestorModel,
          as: 'campaignInvestor',
          // attributes: ['userId', 'investorId'],
          required: true,
          include: [
            {
              model: UserModel,
              as: 'user',
            },
            {
              model: InvestorPaymentOptionModel,
              as: 'investorBank',
              where: {
                deletedAt: null,
              },
              include: [
                {
                  model: InvestorBankModel,
                  as: 'bank',
                },
                {
                  model: InvestorCardModel,
                  as: 'card',
                },
              ],
              required: false,
            },
          ],
        },
        {
          model: CampaignModel,
          as: 'campaign',
          include: [
            {
              model: IssuerModel,
              as: 'issuer',
              attributes: ['issuerName', 'issuerId', 'email'],
              include: {
                model: IssuerBankModel,
                as: 'issuerBank',
                attributes: ['accountName'],
                where: {
                  deletedAt: null,
                  accountType: {
                    [Op.ne]: ['wallet'],
                  },
                },
                required: false,
              },
            },
          ],
        },
      ],
    });

    if (!fundObj) {
      return;
    }
    return CampaignFundMap.toDomain(fundObj);
  }

  async fetchAllByCampaignWithSuccessfulChargesAndWithoutDocumentSent(campaignId) {
    try {
      const chargeModelInclude = {
        model: ChargeModel,
        as: 'charge',
        required: true,
        where: {
          chargeStatus: {
            [Op.in]: [ChargeStatus.SUCCESS],
          },
          [Op.and]: {
            documentSent: { [Op.eq]: null },
            refunded: { [Op.or]: [null, false] },
          },
        },
      };

      const all = await CampaignFundModel.findAll({
        where: { campaignId },
        include: [
          chargeModelInclude,
          {
            model: InvestorModel,
            as: 'campaignInvestor',
            attributes: ['investorId', 'userId', 'ncAccountId'],
          },
        ],
      });

      return all.map((campaignFundObj) => CampaignFundMap.toDomain(campaignFundObj));
    } catch (e) {
      throw new DatabaseError(e);
    }
  }

  async fetchAllInvesmentsByInvestorIdAndEntity(investorId: string, entityId: string) {
    const campaignFundsQuery = `
    SELECT campaignFunds.amount as investedAmount, campaignFunds.createdAt as investedDate, campaigns.campaignName,
    campaigns.campaignId, campaigns.campaignStage, campaigns.annualInterestRate, campaigns.loanDuration
    FROM campaignFunds JOIN charges on campaignFunds.chargeId = charges.chargeId Inner Join campaigns
    on campaignFunds.campaignId = campaigns.campaignId where campaignFunds.investorId = "${investorId}" and campaignFunds.entityId = "${entityId}"
     and charges.chargeId is not null and charges.refundRequestDate is null and campaigns.deletedAt is null;
  `;

    return sequelize.query(campaignFundsQuery, {
      type: Sequelize.QueryTypes.SELECT,
    });
  }

  async fetchByEntityIdAndCampaignId(entityId, campaignId, findDeleted = false) {
    try {
      const fundObj = await CampaignFundModel.findOne({
        where: {
          entityId,
          campaignId,
        },
        include: [
          {
            model: ChargeModel,
            as: 'charge',
            required: true,
          },
        ],
      });

      if (!fundObj) {
        return false;
      }

      return CampaignFundMap.toDomain(fundObj);
    } catch (e) {
      throw new DatabaseError(e);
    }
  }

  async fetchTotalAmountOfCampaigns(
    quarterStartDate,
    previousQuartersDate,
    yearStartDate,
    currentDate,
  ) {
    try {
      const previousQuartersAmount = await CampaignFundModel.findAll({
        where: {
          createdAt: {
            [Op.gte]: yearStartDate,
            [Op.lte]: previousQuartersDate,
          },
          chargeId: {
            [Op.ne]: null,
          },
          deletedAt: null,
        },
        attributes: ['campaignFundId', 'amount'],
        include: [
          {
            model: ChargeModel,
            as: 'charge',
          },
        ],
      });
      let sumOfAmount = 0;
      if (previousQuartersAmount.length > 0) {
        const previousQuartersAmountData = previousQuartersAmount.filter(
          (campaignFundObj) => {
            const charge = campaignFundObj.dataValues.charge.dataValues;
            return charge.refundRequestDate === null && charge.deletedAt === null;
          },
        );
        let amountArray = [];
        previousQuartersAmountData.forEach((campaignFundObj) => {
          amountArray.push(campaignFundObj.dataValues.amount);
        });
        sumOfAmount = amountArray.reduce((previousValue, currentValue) => {
          return previousValue + currentValue;
        });
      }

      const currentQuarterAmount = await CampaignFundModel.findAll({
        where: {
          createdAt: {
            [Op.gte]: quarterStartDate,
            [Op.lte]: moment().format('YYYY-MM-DD'),
          },
          chargeId: {
            [Op.ne]: null,
          },
          deletedAt: null,
        },
        attributes: ['campaignFundId', 'amount', 'createdAt'],
        include: [
          {
            model: ChargeModel,
            as: 'charge',
          },
        ],
      });
      let currentQuarterResults = [];
      if (currentQuarterAmount.length > 0) {
        const currentQuarterCampaignFundData = currentQuarterAmount.filter(
          (campaignFundObj) => {
            const charge = campaignFundObj.dataValues.charge.dataValues;
            return charge.refundRequestDate === null && charge.deletedAt === null;
          },
        );
        let currentQuarterData = [];

        currentQuarterCampaignFundData.forEach((campaignFundObj) => {
          currentQuarterData.push({
            totalInvested: campaignFundObj.dataValues.amount,
            investmentDate: moment(campaignFundObj.dataValues.createdAt).format(
              'YYYY-MM-DD',
            ),
          });
        });

        const currentQuarterSumAmountByDate = Object.values(
          currentQuarterData.reduce((previousValue, currentValue) => {
            previousValue[currentValue.investmentDate] = previousValue[
              currentValue.investmentDate
            ] || { investmentDate: currentValue.investmentDate, totalInvested: 0 };
            previousValue[
              currentValue.investmentDate
            ].totalInvested += +currentValue.totalInvested;
            return previousValue;
          }, {}),
        );
        currentQuarterResults = currentQuarterSumAmountByDate.sort((a: any, b: any) => {
          const date1: any = moment(a.investmentDate);
          const date2: any = moment(b.investmentDate);
          return date1 - date2;
        });
      }
      const previousQuarterAmount =
        currentDate.format('YYYY-MM-DD') === yearStartDate ? 0 : sumOfAmount;
      return {
        previousQuarterAmount,
        currentQuarterResults,
      };
    } catch (e) {
      throw new DatabaseError(e);
    }
  }

  async fetchTotalAmountOfActiveCampaigns() {
    try {
      const activeCampaignsFundData = await CampaignFundModel.findAll({
        where: {
          chargeId: {
            [Op.ne]: null,
          },
          deletedAt: null,
        },
        include: [
          {
            model: ChargeModel,
            as: 'charge',
          },
          {
            model: CampaignModel,
            as: 'campaign',
            attributes: [
              'campaignStartDate',
              'campaignExpirationDate',
              'campaignName',
              'campaignStage',
            ],
          },
        ],
      });
      if (activeCampaignsFundData.length === 0) {
        return [];
      }
      const activeCampaignsFundFilteredData = activeCampaignsFundData.filter(
        (campaignFundObj) => {
          const charge = campaignFundObj.dataValues.charge.dataValues;
          const campaign = campaignFundObj.dataValues.campaign;
          return (
            campaign &&
            charge.refundRequestDate === null &&
            charge.deletedAt === null &&
            campaign.dataValues.campaignStage === 'Fundraising'
          );
        },
      );

      const uniqueCampaign = [];
      const activeCampaignsData = [];
      activeCampaignsFundFilteredData.map((campaignFundObj) => {
        const campaignName = campaignFundObj.dataValues.campaign.dataValues.campaignName;
        const filterCampaign = activeCampaignsFundFilteredData.filter(
          (camapaignFund) =>
            camapaignFund.dataValues.campaign.dataValues.campaignName === campaignName,
        );
        let amountArray = [];
        filterCampaign.forEach((campaignFundObj) => {
          amountArray.push(campaignFundObj.dataValues.amount);
        });
        const sumOfAmount = amountArray.reduce((previousValue, currentValue) => {
          return previousValue + currentValue;
        });

        if (
          !uniqueCampaign.includes(
            campaignFundObj.dataValues.campaign.dataValues.campaignName,
          )
        ) {
          activeCampaignsData.push({
            investedAmount: sumOfAmount,
            campaignStartDate:
              campaignFundObj.dataValues.campaign.dataValues.campaignStartDate,
            campaignExpirationDate:
              campaignFundObj.dataValues.campaign.dataValues.campaignExpirationDate,
            campaignName: campaignFundObj.dataValues.campaign.dataValues.campaignName,
          });
          uniqueCampaign.push(
            campaignFundObj.dataValues.campaign.dataValues.campaignName,
          );
        }
      });
      return activeCampaignsData;
    } catch (e) {
      throw new DatabaseError(e);
    }
  }

  async fetchInvestorInvestmentOnCampaignsWithPagination({
    paginationOptions,
    investorId,
  }) {
    try {
      const campaignFund = await CampaignFundModel.findAll({
        where: {
          investorId,
          deletedAt: null,
          chargeId: {
            [Op.ne]: null,
          },
        },
        order: [['createdAt', 'DESC']],
        include: [
          {
            model: ChargeModel,
            as: 'charge',
          },
          {
            model: CampaignModel,
            as: 'campaign',
            attributes: ['campaignName'],
          },
        ],
        limit: paginationOptions.limit(),
        offset: paginationOptions.offset(),
      });

      const countofCampaignFund = await this.count(investorId);
      const paginationData = new PaginationData(paginationOptions, countofCampaignFund);

      const campaignFundData = campaignFund.filter((campaignFundObj) => {
        const charge = campaignFundObj.dataValues.charge.dataValues;
        return charge.refundRequestDate === null && charge.deletedAt === null;
      });
      campaignFundData.map((campaignFundObj) => {
        const campaignFund = {
          campaignName: campaignFundObj.dataValues.campaign.dataValues.campaignName,
          investedAmount: campaignFundObj.dataValues.amount,
          investmentDate: moment(campaignFundObj.dataValues.createdAt).format(
            'YYYY-MM-DD',
          ),
        };
        paginationData.addItem(campaignFund);
      });
      return paginationData;
    } catch (e) {
      throw new DatabaseError(e);
    }
  }

  async fetchInvestorInvestmentOnCampaignsWithOutPagination({ investorId }) {
    try {
      const campaignFund = await CampaignFundModel.findAll({
        where: {
          investorId,
          chargeId: {
            [Op.ne]: null,
          },
          deletedAt: null,
        },
        order: [['createdAt', 'DESC']],
        nest: true,
        raw: true,
        include: [
          {
            model: ChargeModel,
            as: 'charge',
          },
          {
            model: CampaignModel,
            as: 'campaign',
            attributes: ['campaignName'],
          },
        ],
      });

      let amountArray = [];
      if (campaignFund.length > 0) {
        const campaignFundData = campaignFund.filter((campaignFundObj) => {
          const charge = campaignFundObj.charge;
          return charge.refundRequestDate === null && charge.deletedAt === null;
        });
        campaignFundData.forEach((campaignFundObj) => {
          amountArray.push({
            campaignName: campaignFundObj.campaign.campaignName,
            investedAmount: campaignFundObj.amount,
            investmentDate: moment(campaignFundObj.createdAt).format('YYYY-MM-DD'),
            investmentStatus: campaignFundObj.charge.chargeStatus,
          });
        });
      }
      return amountArray;
    } catch (e) {
      throw new DatabaseError(e);
    }
  }

  async count(investorId: string) {
    try {
      const campaignFundsQuery = `select count(*) as totalCounts from campaignFunds cf join charges c on c.chargeId=cf.chargeId
      where cf.chargeId is not null and cf.deletedAt is null and investorId='${investorId}'
      and c.deletedAt is null and c.refundRequestDate is null`;

      const count = await sequelize.query(campaignFundsQuery, {
        type: Sequelize.QueryTypes.SELECT,
      });

      let counts = 0;
      if (count.length > 0) {
        counts = count[0].totalCounts;
      }
      return counts;
    } catch (e) {
      throw new DatabaseError(e);
    }
  }

  async fetchInvestorCampaignInvestment({ investorId, campaignId, paginationOptions }) {
    try {
      const campaignFund = await CampaignFundModel.findAll({
        where: {
          investorId,
          campaignId,
          chargeId: {
            [Op.ne]: null,
          },
          deletedAt: null,
        },
        include: [
          {
            model: ChargeModel,
            as: 'charge',
          },
          {
            model: CampaignModel,
            as: 'campaign',
            attributes: ['campaignName'],
          },
        ],
        limit: paginationOptions.limit(),
        offset: paginationOptions.offset(),
      });
      const countofCampaignFund = await this.countCampaignFundByInvestorAndCampaignId(
        investorId,
        campaignId,
      );
      const paginationData = new PaginationData(paginationOptions, countofCampaignFund);

      const campaignFundData = campaignFund.filter((campaignFundObj) => {
        const charge = campaignFundObj.dataValues.charge.dataValues;
        return charge.refundRequestDate === null && charge.deletedAt === null;
      });
      campaignFundData.map((campaignFundObj) => {
        const campaignFund = {
          campaignName: campaignFundObj.dataValues.campaign.dataValues.campaignName,
          investedAmount: campaignFundObj.dataValues.amount,
          investmentDate: moment(campaignFundObj.dataValues.createdAt).format(
            'YYYY-MM-DD',
          ),
        };
        paginationData.addItem(campaignFund);
      });
      return paginationData;
    } catch (e) {
      throw new DatabaseError(e);
    }
  }

  async countCampaignFundByInvestorAndCampaignId(investorId: string, campaignId: string) {
    try {
      const campaignFundsQuery = `select count(*) as totalCounts from campaignFunds cf join charges c on c.chargeId=cf.chargeId
      where cf.chargeId is not null and cf.deletedAt is null and investorId='${investorId}' and campaignId='${campaignId}'
      and c.deletedAt is null and c.refundRequestDate is null`;

      const count = await sequelize.query(campaignFundsQuery, {
        type: Sequelize.QueryTypes.SELECT,
      });

      let counts = 0;
      if (count.length > 0) {
        counts = count[0].totalCounts;
      }
      return counts;
    } catch (e) {
      throw new DatabaseError(e);
    }
  }

  async fetchByCampaignToExport(campaignId) {
    try {
      const includes = [
        {
          model: ChargeModel,
          as: 'charge',
          required: true,
          where: {
            chargeStatus: {
              [Op.in]: ['success', 'pending'],
            },
          },
        },
        {
          model: CampaignModel,
          as: 'campaign',
          attributes: ['campaignName'],
          include: {
            model: CampaignOfferingChangeModel,
            as: 'campaignOfferingChange',
            attributes: ['investorId', 'reconfirmed'],
          },
        },
        {
          model: InvestorModel,
          as: 'campaignInvestor',
          required: true,
          include: [
            {
              model: UserModel,
              as: 'user',
              required: true,
              attributes: [
                'firstName',
                'lastName',
                'email',
                'zipCode',
                'address',
                'city',
                'state',
                'apartment',
              ],
            },
          ],
        },
      ];
      const data = await CampaignFundModel.findAll({
        include: includes,
        where: {
          campaignId,
        },
        order: [['createdAt', 'desc']],
      });

      return Promise.all(
        data.map(async (fund) => {
          const campaignFund = CampaignFundMap.toDomain(fund);
          campaignFund.setIncludeWallet(false);
          const hybridTransactions = await this.hybridTransaction.fetchAllByCampaignFundId(
            campaignFund.campaignFundId,
            ['success', 'pending'],
          );
          if (hybridTransactions.length > 0) {
            campaignFund.setHybridTransaction(hybridTransactions);
            campaignFund.setIncludeWallet(true);
          }
          return campaignFund;
        }),
      );
    } catch (e) {
      throw new DatabaseError(e);
    }
  }

  async fetchByCampaignForNotification(campaignId) {
    try {
      const campaignFundQuery = `
      select
        u.email,u.firstName,c.campaignName,c.slug,c.campaignId,i.investorId, u.fcmToken
      from
        campaignFunds cf join campaigns c on c.campaignId = cf.campaignId join investors i on i.investorId = cf.investorId  join users u on u.userId = i.userId
      where
        c.campaignId = '${campaignId}'
      group by i.investorId`;

      return sequelize.query(campaignFundQuery, {
        type: Sequelize.QueryTypes.SELECT,
      });
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  async fetchAllByInvestorId(investorId, entityId = null) {
    const includes = [
      {
        model: ChargeModel,
        as: 'charge',
        required: true,
        paranoid: false,
        attributes: ['chargeStatus', 'chargeId'],
      },
      {
        model: HybridTransactionModel,
        as: 'campaignHybridTransactions',
      },
      {
        model: CampaignModel,
        as: 'campaign',
        attributes: ['campaignId', 'campaignName', 'campaignStage'],
      },
    ];
    const campaignFunds = await CampaignFundModel.findAll({
      where: {
        investorId,
        entityId,
      },
      include: includes,
    });

    return Promise.all(
      campaignFunds.map(async (campaignFund) => {
        const fund = CampaignFundMap.toDomain(campaignFund);
        const hybridTransactions = await this.hybridTransaction.fetchAllByCampaignFundId(
          fund.campaignFundId,
        );

        if (hybridTransactions.length > 0) {
          fund.setHybridTransaction(hybridTransactions);
          fund.setIncludeWallet(true);
        } else {
          fund.setIncludeWallet(false);
        }
        return fund;
      }),
    );
  }

  async fetchByCampaignForRefund(campaignId) {
    try {
      const includes = [
        {
          model: ChargeModel,
          as: 'charge',
          required: true,
        },
        {
          model: CampaignModel,
          as: 'campaign',
          attributes: ['campaignName'],
          include: {
            model: CampaignOfferingChangeModel,
            as: 'campaignOfferingChange',
            attributes: ['investorId', 'reconfirmed'],
          },
        },
        {
          model: InvestorModel,
          as: 'campaignInvestor',
          required: true,
          include: [
            {
              model: UserModel,
              as: 'user',
              required: true,
              attributes: [
                'firstName',
                'lastName',
                'email',
                'zipCode',
                'address',
                'city',
                'state',
              ],
            },
          ],
        },
      ];
      const rows = await CampaignFundModel.findAll({
        include: includes,
        where: {
          campaignId,
        },
        order: [['createdAt', 'desc']],
      });
      return Promise.all(
        rows.map(async (row) => {
          const campaignFund = CampaignFundMap.toDomain(row);
          campaignFund.setIncludeWallet(false);
          const hybridTransactions = await this.hybridTransaction.fetchAllByCampaignFundId(
            campaignFund.campaignFundId,
          );
          if (hybridTransactions.length > 0) {
            campaignFund.setHybridTransaction(hybridTransactions);
            campaignFund.setIncludeWallet(true);
          }

          return campaignFund;
        }),
      );
    } catch (e) {
      throw new DatabaseError(e);
    }
  }

  async getInvestorPortfolioInvestments(investorId, entityId = null) {
    let totalCommittedWhere = `investorId = '${investorId}'  and cf.deletedAt is null`;
    let genericWhere = `investorId = '${investorId}'  and cf.deletedAt is null and (c.chargeStatus = '${ChargeStatus.SUCCESS}' or c.chargeStatus = '${ChargeStatus.PENDING}')`;

    if (entityId === null) {
      totalCommittedWhere += ` and entityId is null`;
      genericWhere += ` and entityId is null`;
    }

    if (entityId != null) {
      totalCommittedWhere += ` and entityId='${entityId}'`;
      genericWhere += ` and entityId='${entityId}'`;
    }

    let totalDebtInvestedWhere = `${genericWhere} and ca.investmentType = 'Debt' and ( ca.campaignStage = '${CampaignStage.FUNDED}' or ca.campaignStage = '${CampaignStage.FULLY_REPAID}')`;
    let totalEquityInvestedWhere = `${genericWhere} and ca.investmentType = 'Equity' and ( ca.campaignStage = '${CampaignStage.FUNDED}' or ca.campaignStage = '${CampaignStage.FULLY_REPAID}')`;
    let totalRevShareInvestedWhere = `${genericWhere} and ca.investmentType = 'Revenue Share' and ( ca.campaignStage = '${CampaignStage.FUNDED}' or ca.campaignStage = '${CampaignStage.FULLY_REPAID}')`;
    let totalConvertibleNoteInvestedWhere = `${genericWhere} and ca.investmentType = 'Convertible Note' and ( ca.campaignStage = '${CampaignStage.FUNDED}' or ca.campaignStage = '${CampaignStage.FULLY_REPAID}')`;
    let totalSafeInvestedWhere = `${genericWhere} and ca.investmentType = 'SAFE' and ( ca.campaignStage = '${CampaignStage.FUNDED}' or ca.campaignStage = '${CampaignStage.FULLY_REPAID}')`;
    let totalEquityLLCInvestedWhere = `${genericWhere} and ca.investmentType = 'Equity (LLC)' and ( ca.campaignStage = '${CampaignStage.FUNDED}' or ca.campaignStage = '${CampaignStage.FULLY_REPAID}')`;
    let totalSafeDiscountInvestedWhere = `${genericWhere} and ca.investmentType = 'SAFE - DISCOUNT' and ( ca.campaignStage = '${CampaignStage.FUNDED}' or ca.campaignStage = '${CampaignStage.FULLY_REPAID}')`;
    let totalPendingDebtAndRevInvestmentWhere = `${genericWhere} and (ca.investmentType = 'Debt' or ca.investmentType = 'Revenue Share') and ca.campaignStage = 'Fundraising'`;
    let totalPendingEquityConvertibleAndSafeWhere = `${genericWhere} and (ca.investmentType = 'Equity' or ca.investmentType = 'Convertible Note' or ca.investmentType = 'SAFE' or ca.investmentType = 'SAFE - DISCOUNT' or ca.investmentType = 'Equity (LLC)') and ca.campaignStage = 'Fundraising'`;

    const totalCommittedQuery = `select sum(amount) as totalCommitted from campaignFunds cf join charges c on cf.chargeId = c.chargeId where ${totalCommittedWhere}`;
    const successfulInvestedQuery = `select sum(amount) as successfulInvested from campaignFunds cf join charges c on cf.chargeId = c.chargeId where ${genericWhere}`;
    const totalDebtInvestedQuery = `select sum(amount) as totalDebtInvested from campaignFunds cf join charges c on cf.chargeId = c.chargeId join campaigns ca on cf.campaignId = ca.campaignId where ${totalDebtInvestedWhere}`;
    const totalEquityInvestedQuery = `select sum(amount) as totalEquityInvested from campaignFunds cf join charges c on cf.chargeId = c.chargeId join campaigns ca on cf.campaignId = ca.campaignId where ${totalEquityInvestedWhere}`;
    const totalRevShareInvestedQuery = `select sum(amount) as totalRevShareInvested from campaignFunds cf join charges c on cf.chargeId = c.chargeId join campaigns ca on cf.campaignId = ca.campaignId where ${totalRevShareInvestedWhere}`;
    const totalConvertibleNoteInvestedQuery = `select sum(amount) as totalConvertibleNoteInvested from campaignFunds cf join charges c on cf.chargeId = c.chargeId join campaigns ca on cf.campaignId = ca.campaignId where ${totalConvertibleNoteInvestedWhere}`;
    const totalSafeInvestedQuery = `select sum(amount) as totalSafeInvested from campaignFunds cf join charges c on cf.chargeId = c.chargeId join campaigns ca on cf.campaignId = ca.campaignId where ${totalSafeInvestedWhere}`;
    const totalEquityLLCInvestedQuery = `select sum(amount) as totalSafeInvested from campaignFunds cf join charges c on cf.chargeId = c.chargeId join campaigns ca on cf.campaignId = ca.campaignId where ${totalEquityLLCInvestedWhere}`;
    const totalSafeDiscountInvestedQuery = `select sum(amount) as totalSafeDiscountInvested from campaignFunds cf join charges c on cf.chargeId = c.chargeId join campaigns ca on cf.campaignId = ca.campaignId where ${totalSafeDiscountInvestedWhere}`;
    const totalPendingDebtAndRevInvestments = `select sum(amount) as totalPendingDebtAndRevInvested from campaignFunds cf join charges c on cf.chargeId = c.chargeId join campaigns ca on cf.campaignId = ca.campaignId where ${totalPendingDebtAndRevInvestmentWhere}`;
    const totalPendingEquityConvertibleAndSafeInvestments = `select sum(amount) as totalPendingEquityConveritbleSafeInvestments from campaignFunds cf join charges c on cf.chargeId = c.chargeId join campaigns ca on cf.campaignId = ca.campaignId where ${totalPendingEquityConvertibleAndSafeWhere}`;

    const [{ totalCommitted }] = await sequelize.query(totalCommittedQuery, {
      type: Sequelize.QueryTypes.SELECT,
    });
    const [{ successfulInvested }] = await sequelize.query(successfulInvestedQuery, {
      type: Sequelize.QueryTypes.SELECT,
    });
    const [{ totalDebtInvested }] = await sequelize.query(totalDebtInvestedQuery, {
      type: Sequelize.QueryTypes.SELECT,
    });
    const [{ totalEquityInvested }] = await sequelize.query(totalEquityInvestedQuery, {
      type: Sequelize.QueryTypes.SELECT,
    });
    const [{ totalRevShareInvested }] = await sequelize.query(
      totalRevShareInvestedQuery,
      {
        type: Sequelize.QueryTypes.SELECT,
      },
    );
    const [{ totalConvertibleNoteInvested }] = await sequelize.query(
      totalConvertibleNoteInvestedQuery,
      {
        type: Sequelize.QueryTypes.SELECT,
      },
    );
    const [{ totalSafeInvested }] = await sequelize.query(totalSafeInvestedQuery, {
      type: Sequelize.QueryTypes.SELECT,
    });
    const [{ totalEquityLLCInvested }] = await sequelize.query(
      totalEquityLLCInvestedQuery,
      {
        type: Sequelize.QueryTypes.SELECT,
      },
    );
    const [{ totalSafeDiscountInvested }] = await sequelize.query(
      totalSafeDiscountInvestedQuery,
      {
        type: Sequelize.QueryTypes.SELECT,
      },
    );

    const [{ totalPendingDebtAndRevInvested }] = await sequelize.query(
      totalPendingDebtAndRevInvestments,
      {
        type: Sequelize.QueryTypes.SELECT,
      },
    );

    const [{ totalPendingEquityConveritbleSafeInvestments }] = await sequelize.query(
      totalPendingEquityConvertibleAndSafeInvestments,
      {
        type: Sequelize.QueryTypes.SELECT,
      },
    );

    return {
      totalCommitted,
      successfulInvested,
      totalDebtInvested,
      totalEquityInvested,
      totalRevShareInvested,
      totalConvertibleNoteInvested,
      totalSafeInvested,
      totalEquityLLCInvested,
      totalSafeDiscountInvested,
      totalPendingDebtAndRevInvested,
      totalPendingEquityConveritbleSafeInvestments,
    };
  }

  async getJobSupported(investorId, entityId = null) {
    let genericWhere = `(c.chargeStatus = "success" || c.chargeStatus = "pending") and investorId = "${investorId}"`;
    if (entityId != null) {
      genericWhere += ` and entityId = "${entityId}"`;
    } else {
      genericWhere += ` and entityId is null`;
    }
    const jobSupportedQuery = `
    select
      cf.campaignId, ca.issuerId
    from
      campaignFunds cf
      join charges c on c.chargeId = cf.chargeId
      join campaigns ca on ca.campaignId = cf.campaignId
      where
        ${genericWhere}
        group by cf.campaignId`;
    const fetchJobSupported = await sequelize.query(jobSupportedQuery, {
      type: Sequelize.QueryTypes.SELECT,
    });
    if (fetchJobSupported.length) {
      return Promise.all(
        fetchJobSupported.map(async (item) => {
          const employeeLog = await this.employeeLogRepository.fetchByIssuerId(
            item.issuerId,
          );
          if (employeeLog) {
            return {
              employeeCount: employeeLog.getUpdatedEmployeeCount(),
              totalBusinesses: fetchJobSupported.length,
            };
          } else return { employeeCount: 0, totalBusinesses: 0 };
        }),
      );
    } else {
      return [{ employeeCount: 0, totalBusinesses: 0 }];
    }
  }

  async fetchSumInvestmentByCampaignsReport(
    campaignNames,
    includePending = false,
    campaignStatuses,
    startDate,
    endDate,
  ) {
    try {
      startDate = moment(startDate).startOf('day').format('YYYY-MM-DD HH:mm:ss');
      endDate = moment(endDate).endOf('day').format('YYYY-MM-DD HH:mm:ss');
      let where = `c.escrowType != '${CampaignEscrow.NC_BANK}' and cf.chargeId is not null and hc.campaignFundId is not null and i.deletedAt is null and cf.deletedAt is null and cf.createdAt between '${startDate}' AND '${endDate}'`;
      if (campaignNames.length) {
        let status = [];
        campaignNames.forEach((item) => {
          status.push(`"${item}"`);
        });
        where += ` and campaignName in (${status})`;
      } else if (campaignStatuses.length) {
        let status = [];
        campaignStatuses.forEach((item) => {
          status.push(`"${item}"`);
        });
        where += ` and campaignStage in (${status})`;
      }
      const [campaignFunds] = await sequelize.query(
        `
        select
          c.campaignId 'Campaign ID',
          c.campaignName 'Campaign Name',
          c.campaignStage 'Campaign Stage',
          c.escrowType 'Escrow Bank',
          c.campaignMinimumAmount,
          c.campaignTargetAmount,
          CASE WHEN hc.status = '${ChargeStatus.SUCCESS}' THEN sum(cf.netAmount) ELSE 0 END as 'Cleared Amount',
          CASE WHEN hc.status in ('${ChargeStatus.PENDING}','${ChargeStatus.PENDING_REFUND}', '${ChargeStatus.FAILED}', '${ChargeStatus.CANCELLED}', '${ChargeStatus.REFUND_FAILED}', '${ChargeStatus.REFUND_APPROVED}', '${ChargeStatus.REFUND_PROCESSING}', '${ChargeStatus.REFUNDED}', '${ChargeStatus.CANCELATION_PENDING}') THEN sum(cf.netAmount) ELSE 0 END as 'Non-cleared Amount',
          hc.status
        from
          campaignFunds cf
        join
          campaigns c on cf.campaignId = c.campaignId
        join
          hybridTransactions hc on hc.campaignFundId = cf.campaignFundId
        join
          investors i on i.investorId = cf.investorId
        where ${where} group by cf.campaignId, hc.status
        `,
      );

      return campaignFunds;
    } catch (e) {
      throw new DatabaseError(e);
    }
  }
}

export default CampaignFundRepository;
