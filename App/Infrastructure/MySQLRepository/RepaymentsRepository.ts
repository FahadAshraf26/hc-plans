import BaseRepository from '@infrastructure/MySQLRepository/BaseRepository';
import Repayments from '@domain/Core/Repayments/Repayments';
import { IRepaymentsRepository } from '@domain/Core/Repayments/IRepaymentsRepository';
import models from '../Model';
import { injectable } from 'inversify';
const {
  RepaymentModel,
  sequelize,
  Sequelize,
  CampaignModel,
  UserModel,
  InvestorModel,
} = models;
import moment from 'moment';
import DatabaseError from '@infrastructure/Errors/DatabaseError';
import { Op } from 'sequelize';
@injectable()
class RepaymentsRepository extends BaseRepository implements IRepaymentsRepository {
  constructor() {
    super(RepaymentModel, 'repaymentId', Repayments);
  }
  async fetchByInvestorId(investorId: string): Promise<any> {
    const repayments = await RepaymentModel.findAll({
      where: { investorId },
      order: [['createdAt', 'DESC']],
    });
    return repayments.map((item) => Repayments.createFromObject(item));
  }

  async fetchByCampaignId(campaignId: string) {
    const repayments = await RepaymentModel.findAll({
      where: { campaignId },
      order: [['createdAt', 'DESC']],
    });
    return repayments.map((item) => Repayments.createFromObject(item));
  }

  async fetchByInvestorCampaign({
    investorId,
    campaignId,
    entityId,
    paginationOptions,
  }): Promise<any> {
    return super.fetchAll({
      paginationOptions,
      whereConditions: { investorId, campaignId, entityId },
      order: [['createdAt', 'DESC']],
    });
  }

  async fetchByInvestorIdAndGroupByCampaign({
    paginationOptions,
    investorId,
    all,
  }): Promise<any> {
    const repaymentsCountQuery = `SELECT count(*) as totalRepayments from repayments where investorId = "${investorId}"`;
    const allRepaymentsQuery = `SELECT rp.createdAt as repaidDate,rp.interest, rp.principle, rp.status, rp.paymentType, rp.total, rp.accountName, c.campaignName, c.campaignId from repayments rp join campaigns c on rp.campaignId = c.campaignId where rp.investorId = "${investorId}" ORDER BY rp.createdAt DESC ${
      all === 'true'
      ? ''
      : `LIMIT ${paginationOptions.limit()} OFFSET ${paginationOptions.offset()}`
      }`;
    const nextPaymentDateQuery = `SELECT max(createdAt) as maxDate, campaignId from repayments where investorId = "${investorId}" GROUP BY campaignId`;
    const nextPaymentDates = await sequelize.query(nextPaymentDateQuery, {
      type: Sequelize.QueryTypes.SELECT,
    });
    let whereClause = [];
    nextPaymentDates.map((npd) => {
      whereClause.push(
        `pr.createdAt > '${moment(npd.maxDate).format(
          'YYYY-MM-DD HH:mm:ss',
        )}' and ip.campaignId = '${npd.campaignId}'`,
      );
    });
    const nextPaymentsQuery = `SELECT 
    min(pr.createdAt) AS nextPaymentDate, ip.campaignId
      FROM
        investorPayments AS ip
        JOIN projectionReturns AS pr ON (ip.investorPaymentsId = pr.investorPaymentsId)
      WHERE
        ip.investorId = "${investorId}"
        AND (
          ${whereClause.join(' OR ')}
        )
      GROUP BY
          ip.campaignId`;

    const repaymentsCount = await sequelize.query(repaymentsCountQuery, {
      type: Sequelize.QueryTypes.SELECT,
    });
    const nextPayments = await sequelize.query(nextPaymentsQuery, {
      type: Sequelize.QueryTypes.SELECT,
    });
    const allRepayments = await sequelize.query(allRepaymentsQuery, {
      type: Sequelize.QueryTypes.SELECT,
    });

    return { repaymentsCount, allRepayments, nextPayments };
  }

  async fetchByDwollaTransferId(transferId) {
    const repayment = await RepaymentModel.findOne({
      where: { dwollaTransferId: transferId },
    });

    if (!repayment) {
      return null;
    }

    return Repayments.createFromObject(repayment);
  }

  async getLastRepaymentDate(campaignId: string) {
    const repayment = await RepaymentModel.findOne({
      where: { campaignId },
      order: [['createdAt', 'DESC']],
    });

    if (!repayment) {
      return null;
    }

    return repayment.createdAt;
  }
  async fetchInvestorsRepayments() {
    try {
      const repayments = await RepaymentModel.findAll({
        attributes: [
          ['interest', 'interestPaid'],
          ['principle', 'principlePaid'],
          ['createdAt', 'paymentDate'],
        ],
        order: [['createdAt', 'Desc']],
        include: [
          {
            model: InvestorModel,
            as: 'investor',
            include: [
              {
                model: UserModel,
                as: 'user',
                attributes: [
                  ['email', 'investorEmail'],
                  [
                    sequelize.fn(
                      'CONCAT',
                      sequelize.col('firstName'),
                      ' ',
                      sequelize.col('lastName'),
                    ),
                    'investorName',
                  ],
                ],
              },
            ],
          },
          {
            model: CampaignModel,
            as: 'campaign',
            attributes: ['campaignId', 'campaignName'],
          },
        ],
      }).map((data) => data.get({ plain: true }));

      if (repayments.length > 0) {
        return repayments.map((repaymentObj) => {
          return {
            'Investor Name': repaymentObj.investor && repaymentObj.investor.user ? repaymentObj.investor.user.investorName: 'N/A',
            'Investor Email': repaymentObj.investor && repaymentObj.investor.user ? repaymentObj.investor.user.investorEmail: 'N/A',
            'Campaign Id': repaymentObj.campaign.campaignId,
            'Campaign Name': repaymentObj.campaign.campaignName,
            'Interest Paid': repaymentObj.interestPaid,
            'Principal Paid': repaymentObj.principlePaid,
            'Payment Date': moment(repaymentObj.paymentDate).format('YYYY-MM-DD'),
          };
        });
      } else return [];
    } catch (e) {
      throw new DatabaseError(e);
    }
  }

  async fetchByInvestor(investorId: string, entityId: string) {
    const repayments = await RepaymentModel.findAll({
      where: { investorId, entityId },
      include: [
        {
          model: CampaignModel,
          as: 'campaign',
          attributes: ['campaignName'],
        },
      ],
      attributes: ['paymentType', 'total', 'createdAt'],
      order: [['createdAt', 'DESC']],
    });

    return repayments.map((item) => {
      const repayment = Repayments.createFromObject(item);
      if (item.campaign) {
        repayment.setCampaignName(item.campaign.campaignName);
      }
      return repayment;
    });
  }

  async deleteAllRepayments(campaignIds: string[]): Promise<any> {
    try {
      return RepaymentModel.destroy({
          where: {
            campaignId: {
              [Op.in]: campaignIds,
            },
          },
          force: true,
        });
    } catch (error) {
      throw new DatabaseError(error);
    }
  }
}

export default RepaymentsRepository;
