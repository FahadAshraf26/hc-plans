import { IProjectionReturnsRepository } from '@domain/Core/ProjectionReturns/IProjectionReturnsRepository';
import models from '../Model';
import { injectable } from 'inversify';
import DatabaseError from '@infrastructure/Errors/DatabaseError';
import PaginationOptions from '@domain/Utils/PaginationOptions';
import moment from 'moment';
import PaginationData from '@domain/Utils/PaginationData';
import { ProjectionReturns } from '@domain/Core/ProjectionReturns/ProjectionReturns';
import { InvestorPayments } from '@domain/Core/InvestorPayments/InvestorPayments';

const {
  sequelize,
  Sequelize,
  RepaymentModel,
  InvestorPaymentsModel,
  ProjectionReturnsModel,
  CampaignModel,
  UserModel,
  InvestorModel,
  CampaignFundModel,
  ChargeModel,
} = models;
const { Op } = Sequelize;

type fetchProjectionsByInvestorCampaign = {
  paginationOptions: PaginationOptions;
  investorId: string;
  campaignId: string;
  entityId: string;
};
type fetchProjectionsByInvestorWithPagination = {
  paginationOptions: PaginationOptions;
  investorId: string;
};
type fetchProjectionsByInvestorWithoutPagination = {
  investorId: string;
};

@injectable()
class ProjectionReturnsRepository implements IProjectionReturnsRepository {
  constructor() {}

  /**
   *  Store ProjectionReturn in database
   * @param {ProjectionReturn} projectionReturns
   * @returns boolean
   */
  async add(projectionReturn): Promise<boolean> {
    try {
      return await ProjectionReturnsModel.create(projectionReturn);
    } catch (error) {
      throw Error(error);
    }
  }

  async fetchProjectionsByInvestorCampaign({
    paginationOptions,
    investorId,
    campaignId,
    entityId,
  }: fetchProjectionsByInvestorCampaign): Promise<any> {
    let maxDateQuery = `investorId = '${investorId}' and campaignId = '${campaignId}'`;
    let upComingQuery = `investorId = '${investorId}' and ip.campaignId = '${campaignId}' and pr.deletedAt is null`;
    if (entityId) {
      maxDateQuery += ` and entityId = '${entityId}'`;
      upComingQuery += ` and ip.entityId = '${entityId}'`;
    }
    try {
      const maxDate = `SELECT
                        max(createdAt) as lastPaidDate
                      FROM
                        repayments
                      WHERE
                        ${maxDateQuery}
                        `;
      const maxDateResult = await sequelize.query(maxDate, {
        type: Sequelize.QueryTypes.SELECT,
      });

      let date =
        maxDateResult[0].lastPaidDate !== null
          ? moment(maxDateResult[0].lastPaidDate).format('YYYY-MM-DD HH:mm:ss')
          : null;
      let queryCase = `CASE WHEN '${date}' >= pr.createdAt THEN
      'repaid'
    WHEN ('${date}' < pr.createdAt
  AND pr.createdAt > NOW()) THEN
      'upcoming'
    WHEN ('${date}' < pr.createdAt
  AND pr.createdAt < NOW()) THEN
      'in process'
    END AS 'status'`;
      if (date === null) {
        queryCase = `'upcoming' as status`;
      }
      const upcomingPayments = `SELECT
                    pr.*,
                    sum(pr.principle + pr.interest) AS total,
                    ${queryCase}
                    FROM
                      investorPayments ip
                      JOIN projectionReturns pr ON (ip.investorPaymentsId = pr.investorPaymentsId)
                    WHERE
                     ${upComingQuery}
                     AND (pr.createdAt > '${date}' OR '${date}' IS NULL)
                    GROUP BY
                      pr.projectionReturnsId  
                    ORDER BY
                      createdAt ASC
                    LIMIT ${paginationOptions.limit()}
                    OFFSET ${paginationOptions.offset()}
      `;

      const upcomingPaymentsResults = await sequelize.query(upcomingPayments, {
        type: Sequelize.QueryTypes.SELECT,
      });
      return upcomingPaymentsResults;
    } catch (err) {
      throw new DatabaseError(err.message);
    }
  }

  async fetchProjectionsByInvestorWithPagination({
    paginationOptions,
    investorId,
  }: fetchProjectionsByInvestorWithPagination): Promise<any> {
    try {
      const repayments = await RepaymentModel.findAll({
        where: {
          investorId,
        },
        attributes: [[sequelize.fn('max', sequelize.col('createdAt')), 'lastPaidDate']],
      });

      const lastPaidDate = repayments[0].dataValues.lastPaidDate;
      let date =
        lastPaidDate !== null ? moment(lastPaidDate).format('YYYY-MM-DD HH:mm:ss') : null;

      const { rows, count } = await InvestorPaymentsModel.findAndCountAll({
        where: {
          investorId,
        },
        include: [
          {
            model: CampaignModel,
          },
          {
            model: ProjectionReturnsModel,
            as: 'investorPaymentsProjections',
          },
        ],
        limit: paginationOptions.limit(),
        offset: paginationOptions.offset(),
      });

      const paginationData = new PaginationData(paginationOptions, count);

      rows.forEach((investorPayment) => {
        let projectionReturns = [];
        const investorPaymentsObj = InvestorPayments.createFromObject(investorPayment);
        if (investorPayment.investorPaymentsProjections) {
          investorPayment.investorPaymentsProjections.map((projectionObj) => {
            const total = projectionObj.principle + projectionObj.interest;
            const projectionReturnsObj = ProjectionReturns.createFromObject(
              projectionObj,
            );
            const status = this.calculateStatus(date, projectionReturnsObj);

            const projectionReturn = {
              ...projectionReturnsObj,
              total,
              status,
            };

            projectionReturns.push(projectionReturn);
          });
          const upcomingProjectionReturns = projectionReturns.filter(
            (item) => item.status === 'upcoming',
          );
          investorPaymentsObj.setCampaign(
            investorPayment.campaign.dataValues.campaignName,
          );
          investorPaymentsObj.setInvestorPaymentsProjections(upcomingProjectionReturns);
        }
        paginationData.addItem(investorPaymentsObj);
      });

      return paginationData;
    } catch (err) {
      throw new DatabaseError(err.message);
    }
  }

  async fetchProjectionsByInvestorWithoutPagination({
    investorId,
  }: fetchProjectionsByInvestorWithoutPagination): Promise<any> {
    try {
      const repayments = await RepaymentModel.findAll({
        where: {
          investorId,
        },
        attributes: [[sequelize.fn('max', sequelize.col('createdAt')), 'lastPaidDate']],
        order: [['createdAt', 'DESC']],
      });

      const lastPaidDate = repayments[0].dataValues.lastPaidDate;
      let date =
        lastPaidDate !== null ? moment(lastPaidDate).format('YYYY-MM-DD HH:mm:ss') : null;

      const investorProjectionReturns = await InvestorPaymentsModel.findAll({
        where: {
          investorId,
        },
        include: [
          {
            model: CampaignModel,
          },
          {
            model: ProjectionReturnsModel,
            as: 'investorPaymentsProjections',
          },
        ],
        order: [['createdAt', 'DESC']],
      });
      return investorProjectionReturns.map((investorPayment) => {
        let projectionReturns = [];
        const investorPaymentsObj = InvestorPayments.createFromObject(investorPayment);
        if (investorPayment.investorPaymentsProjections) {
          investorPayment.investorPaymentsProjections.map((projectionObj) => {
            const total = projectionObj.principle + projectionObj.interest;
            const projectionReturnsObj = ProjectionReturns.createFromObject(
              projectionObj,
            );
            const status = this.calculateStatus(date, projectionReturnsObj);

            const projectionReturn = {
              ...projectionReturnsObj,
              total,
              status,
            };
            projectionReturns.push(projectionReturn);
          });
          const upcomingProjectionReturns = projectionReturns.filter(
            (item) => item.status === 'upcoming',
          );
          investorPaymentsObj.setCampaign(
            investorPayment.campaign.dataValues.campaignName,
          );
          investorPaymentsObj.setCampaignStage(
            investorPayment.campaign.dataValues.campaignStage,
          );
          upcomingProjectionReturns.sort(function (a, b) {
            return a.createdAt - b.createdAt;
          });
          investorPaymentsObj.setInvestorPaymentsProjections(upcomingProjectionReturns);
          return investorPaymentsObj;
        }
      });
    } catch (err) {
      throw new DatabaseError(err.message);
    }
  }

  calculateStatus(date, projectionReturnsObj) {
    let status: string;
    if (date === null) {
      status = 'upcoming';
    } else if (
      moment(date) < moment(projectionReturnsObj.createdAt) &&
      moment(projectionReturnsObj.createdAt) > moment()
    ) {
      status = 'upcoming';
    } else {
      status = 'N/A';
    }
    return status;
  }

  async fetchInvestorsProjections() {
    const query =
      'SELECT u.firstName,u.lastName,u.email,sum(cf.amount) AS `totalInvested`,c.campaignId ,c.campaignName, Round(projections.totalProjections,4) AS `totalProjections`,Round(( projections.totalProjections / cf.amount ),4) AS `investorRateOfReturn`,repayments.principalPaid,repayments.interestPaid FROM investors i JOIN users u      ON u.userId = i.userId    JOIN campaignFunds cf      ON cf.investorId = i.investorId    JOIN charges ch      ON ch.chargeId = cf.chargeId    JOIN campaigns c      ON c.campaignId = cf.campaignId,    (SELECT sum(pr.principle + pr.interest) AS totalProjections,            ip.investorId,            ip.campaignId     FROM   investorPayments ip            JOIN projectionReturns pr              ON pr.investorPaymentsId = ip.investorPaymentsId     WHERE   pr.deletedAt is null              GROUP  BY ip.investorId,               ip.campaignId) projections,     (SELECT sum(principle) AS principalPaid , sum(interest) AS interestPaid,         r.investorId,         r.campaignId       FROM   repayments r       GROUP BY  r.investorId,                r.campaignId) repayments         WHERE  i.deletedAt IS NULL    AND ch.refundRequestDate IS NULL    AND ch.deletedAt IS NULL    AND projections.investorId = i.investorId    AND repayments.investorId = i.investorId    AND projections.campaignId = c.campaignId    AND repayments.campaignId = c.campaignId GROUP  BY i.investorId,       c.campaignId,       projections.investorId,       projections.totalProjections,       repayments.principalPaid,       repayments.investorId,       cf.amount,       projections.campaignId,       repayments.campaignId';
    const data = await sequelize.query(query, { type: Sequelize.QueryTypes.SELECT });
    return data;
  }

  async fetchAllInvestorsProjections() {
    try {
      const investorPayments = await InvestorPaymentsModel.findAll({
        raw: true,
        nest: true,
        include: [
          {
            model: ProjectionReturnsModel,
            as: 'investorPaymentsProjections',
          },
          {
            model: CampaignModel,
            attributes: ['campaignName', 'campaignId'],
          },
          {
            model: InvestorModel,
            include: [
              {
                model: UserModel,
                as: 'user',
                attributes: ['firstName', 'lastName', 'email'],
              },
            ],
          },
        ],
      });

      if (investorPayments.length > 0) {
        return investorPayments.map((investorPaymentObj) => {
          return {
            'First Name': investorPaymentObj.investor.user.firstName,
            'Last Name': investorPaymentObj.investor.user.lastName,
            Email: investorPaymentObj.investor.user.email,
            'Campaign Name': investorPaymentObj.campaign.campaignName,
            'Campaign Id': investorPaymentObj.campaign.campaignId,
            Interest: investorPaymentObj.investorPaymentsProjections.interest,
            Principal: investorPaymentObj.investorPaymentsProjections.principle,
            'Payment Date': moment(
              investorPaymentObj.investorPaymentsProjections.createdAt,
            ).format('YYYY-MM-DD'),
            'Updated At': moment(
              investorPaymentObj.investorPaymentsProjections.updatedAt,
            ).format('YYYY-MM-DD'),
            'Deleted At': investorPaymentObj.investorPaymentsProjections.deletedAt,
          };
        });
      }
      return [];
    } catch (err) {
      throw new DatabaseError(err.message);
    }
  }

  async deleteProjectionReturnsByInvestorPaymentIds(investorPaymentsIds: string[]){
    try {
      ProjectionReturnsModel.destroy({
        where: {
          investorPaymentsId: {
            [Op.in]: investorPaymentsIds,
          }
        },
        force: true,
      })
    } catch (error) {
      throw new DatabaseError(error.message)
    }
  }
}

export default ProjectionReturnsRepository;
