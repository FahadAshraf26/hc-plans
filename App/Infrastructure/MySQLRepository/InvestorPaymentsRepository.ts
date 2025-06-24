import BaseRepository from '@infrastructure/MySQLRepository/BaseRepository';
import { IInvestorPaymentsRepository } from '@domain/Core/InvestorPayments/IInvestorPaymentsRepository';
import { injectable } from 'inversify';
import { InvestorPayments } from '@domain/Core/InvestorPayments/InvestorPayments';
import models from '../Model';
import DatabaseError from '@infrastructure/Errors/DatabaseError';
import { getDuration } from '@infrastructure/Utils/GetTimeDuration';
import async from 'async';
import moment from 'moment';
import { CampaignStage } from '@domain/Core/ValueObjects/CampaignStage';

const { InvestorPaymentsModel, ProjectionReturnsModel, sequelize, Sequelize } = models;
const { Op } = Sequelize;

@injectable()
class InvestorPaymentsRepository extends BaseRepository
  implements IInvestorPaymentsRepository {
  constructor() {
    super(InvestorPaymentsModel, 'investorRepaymentsId', InvestorPayments);
  }

  /**
   *  Store InvestorPayment in database
   * @param {InvestorPayment} investorPayment
   * @returns boolean
   */
  async add(investorPayment): Promise<boolean> {
    try {
      return await super.add(investorPayment);
    } catch (error) {
      throw Error(error);
    }
  }

  async getInvestorPaymentsWithProrate(
    investorId: string,
    campaignId: string,
    prorate: number,
    createdAt,
  ): Promise<Array<InvestorPayments>> {
    const investorPayments = [];
    const investorPaymentsObjects = await InvestorPaymentsModel.findAll({
      where: {
        [Op.and]: [
          sequelize.literal('cast(prorate AS DECIMAL) = ' + `cast(${prorate} AS DECIMAL)`),
          { investorId, campaignId, createdAt },
        ],
      },
    });
    for (let investorPaymentsObject of investorPaymentsObjects) {
      investorPayments.push(InvestorPayments.createFromObject(investorPaymentsObject));
    }
    return investorPayments;
  }

  async getInvestorPayments(investorId: string): Promise<InvestorPayments> {
    const investorPaymentsObj = await InvestorPaymentsModel.findOne({
      where: { investorId },
      include: [{ model: ProjectionReturnsModel, as: 'investorPaymentsProjections' }],
    });

    const investorPayments = InvestorPayments.createFromObject(investorPaymentsObj);
    if (investorPaymentsObj.investorPaymentsProjections) {
      investorPayments.setInvestorPaymentsProjections(
        investorPaymentsObj.investorPaymentsProjections,
      );
    }

    return investorPayments;
  }

  async getInvestorCampaignPayments(
    investorId: string,
    campaignId: string,
  ): Promise<InvestorPayments> {
    const investorPaymentsObj = await InvestorPaymentsModel.findOne({
      where: { investorId, campaignId },
      include: [{ model: ProjectionReturnsModel, as: 'investorPaymentsProjections' }],
    });

    const investorPayments = InvestorPayments.createFromObject(investorPaymentsObj);
    if (investorPaymentsObj.investorPaymentsProjections) {
      investorPayments.setInvestorPaymentsProjections(
        investorPaymentsObj.investorPaymentsProjections,
      );
    }

    return investorPayments;
  }

  async fetchPortfolioData(investorId: string, entityId: string) {
    try {
      let where = `cf.investorId='${investorId}' and cf.chargeId is not null and c.refundRequestDate is null and cf.deletedAt is null and (c.chargeStatus = 'success' or c.chargeStatus = 'pending') and (ca.campaignStage = '${CampaignStage.FUNDRAISING}' or ca.campaignStage = '${CampaignStage.FUNDED}' or ca.campaignStage = '${CampaignStage.FULLY_REPAID}')`;
      let debtWhere = `cf.investorId='${investorId}' and ca.investmentType="Debt" and cf.chargeId is not null and c.refundRequestDate is null and cf.deletedAt is null and (c.chargeStatus = 'success' or c.chargeStatus = 'pending')`;
      let equityWhere = `cf.investorId='${investorId}' and ca.investmentType="Equity" and cf.chargeId is not null and c.refundRequestDate is null and cf.deletedAt is null and (c.chargeStatus = 'success' or c.chargeStatus = 'pending')`;
      let repaidQuery = `investorId='${investorId}'`;
      let futurePaymentQuery = `ip.investorId = '${investorId}' AND pr.createdAt > NOW()`;
      let projectionReturnsQuery = `ip.investorId = '${investorId}' and pr.deletedAt is null`;
      let revshareQuery = `cf.investorId='${investorId}' and ca.investmentType="Revenue Share" and cf.chargeId is not null and c.refundRequestDate is null and cf.deletedAt is null`;
      let convertibleNoteQuery = `cf.investorId='${investorId}' and ca.investmentType="Convertible Note" and cf.chargeId is not null and c.refundRequestDate is null and cf.deletedAt is null`;
      let safeQuery = `cf.investorId='${investorId}' and ca.investmentType="SAFE" and cf.chargeId is not null and c.refundRequestDate is null and cf.deletedAt is null`;
      let EquityLLCQuery = `cf.investorId='${investorId}' and ca.investmentType="Equity (LLC)" and cf.chargeId is not null and c.refundRequestDate is null and cf.deletedAt is null`;
      let safeDiscountQuery = `cf.investorId='${investorId}' and ca.investmentType="SAFE - DISCOUNT" and cf.chargeId is not null and c.refundRequestDate is null and cf.deletedAt is null`;
      if (entityId !== null) {
        where += ` and cf.entityId='${entityId}'`;
        debtWhere += ` and cf.entityId='${entityId}'`;
        equityWhere += ` and cf.entityId='${entityId}'`;
        repaidQuery += ` and entityId='${entityId}'`;
        futurePaymentQuery += ` and ip.entityId='${entityId}'`;
        projectionReturnsQuery += ` and ip.entityId='${entityId}'`;
        revshareQuery += ` and cf.entityId='${entityId}'`;
        convertibleNoteQuery += ` and cf.entityId='${entityId}'`;
        safeQuery += ` and cf.entityId='${entityId}'`;
        EquityLLCQuery += ` and cf.entityId='${entityId}'`;
        safeDiscountQuery += ` and cf.entityId='${entityId}'`;
      } else {
        where += ` and cf.entityId is null`;
        debtWhere += ` and cf.entityId is null`;
        equityWhere += ` and cf.entityId is null`;
        repaidQuery += ` and entityId is null`;
        futurePaymentQuery += ` and ip.entityId is null`;
        projectionReturnsQuery += ` and ip.entityId is null`;
        revshareQuery += ` and cf.entityId is null`;
        convertibleNoteQuery += ` and cf.entityId is null`;
        safeQuery += ` and cf.entityId is null`;
        EquityLLCQuery += ` and cf.entityId is null`;
        safeDiscountQuery += ` and cf.entityId is null`;
      }
      const totalInvestedQuery = `select cf.investorId, sum(cf.amount) as totalInvestedAmount, sum(c.applicationFee) as totalFee, sum(cf.amount + c.applicationFee) as totalInvestedWithFee 
      from campaignFunds as cf
      join charges as c on (cf.chargeId=c.chargeId)
      join campaigns ca on ca.campaignId = cf.campaignId
      where ${where} group by cf.investorId;`;
      const totalDebtInvestment = `select sum(cf.amount) as totalInvestedAmount, sum(c.applicationFee) as totalFee, sum(cf.amount + c.applicationFee) as totalInvestedWithFee 
      from campaignFunds as cf
      join charges as c on (cf.chargeId=c.chargeId)
      join campaigns as ca on cf.campaignId = ca.campaignId
      where ${debtWhere} group by cf.investorId`;
      const totalEquityInvestment = `select sum(cf.amount) as totalInvestedAmount, sum(c.applicationFee) as totalFee, sum(cf.amount + c.applicationFee) as totalInvestedWithFee 
      from campaignFunds as cf
      join charges as c on (cf.chargeId=c.chargeId)
      join campaigns as ca on cf.campaignId = ca.campaignId
      where ${equityWhere} group by cf.investorId`;
      const totalRepaidQuery = `select sum(total) as totalRepaid, sum(principle) as totalPrincipal
      from repayments
      where ${repaidQuery}`;
      const nextPaymentsDateAndAmountQuery = `SELECT
                    pr.createdAt AS nextPaymentDate, sum(pr.principle + pr.interest) AS totalAmount
                  FROM
                    investorPayments AS ip
                    JOIN projectionReturns AS pr ON (ip.investorPaymentsId = pr.investorPaymentsId)
                  WHERE
                    ${futurePaymentQuery}
                  group by pr.createdAt
                  ORDER BY
                    pr.createdAt ASC
                  LIMIT 1;`;
      const totalProjectionResultsQuery = `SELECT
                                      sum(pr.principle + pr.interest) AS total
                                    FROM
                                      investorPayments AS ip
                                      JOIN projectionReturns AS pr ON (pr.investorPaymentsId = ip.investorPaymentsId)
                                    WHERE
                                      ${projectionReturnsQuery}
                                    GROUP BY
                                      pr.investorPaymentsId`;
      const principleForgivenAmountQuery = `select 
                                        sum(principleForgivenAmount) as forgivenAmount 
                                      from 
                                        campaignPrincipleForgivens 
                                      where 
                                        investorId='${investorId}' group by investorId`;
      const totalRevShareInvestment = `select sum(cf.amount) as totalInvestedAmount, sum(c.applicationFee + ht.applicationFee) as totalFee, sum(cf.amount + c.applicationFee + ht.applicationFee) as totalInvestedWithFee 
                                        from campaignFunds as cf
                                        join charges as c on (cf.chargeId=c.chargeId)
                                        join campaigns as ca on cf.campaignId = ca.campaignId
                                        join hybridTransactions as ht on ht.campaignFundId = cf.campaignFundId
                                        where ${revshareQuery} group by cf.investorId`;
      const totalConvertibleNoteInvestment = `select sum(cf.amount) as totalInvestedAmount, sum(c.applicationFee + ht.applicationFee) as totalFee, sum(cf.amount + c.applicationFee + ht.applicationFee) as totalInvestedWithFee 
                                        from campaignFunds as cf
                                        join charges as c on (cf.chargeId=c.chargeId)
                                        join campaigns as ca on cf.campaignId = ca.campaignId
                                        join hybridTransactions as ht on ht.campaignFundId = cf.campaignFundId
                                        where ${convertibleNoteQuery} group by cf.investorId`;
      const totalSafeInvestment = `select sum(cf.amount) as totalInvestedAmount, sum(c.applicationFee + ht.applicationFee) as totalFee, sum(cf.amount + c.applicationFee + ht.applicationFee) as totalInvestedWithFee 
                                        from campaignFunds as cf
                                        join charges as c on (cf.chargeId=c.chargeId)
                                        join campaigns as ca on cf.campaignId = ca.campaignId
                                        join hybridTransactions as ht on ht.campaignFundId = cf.campaignFundId
                                        where ${safeQuery} group by cf.investorId`;
      const totalSafeDiscountInvestment = `select sum(cf.amount) as totalInvestedAmount, sum(c.applicationFee + ht.applicationFee) as totalFee, sum(cf.amount + c.applicationFee + ht.applicationFee) as totalInvestedWithFee 
                                        from campaignFunds as cf
                                        join charges as c on (cf.chargeId=c.chargeId)
                                        join campaigns as ca on cf.campaignId = ca.campaignId
                                        join hybridTransactions as ht on ht.campaignFundId = cf.campaignFundId
                                        where ${safeDiscountQuery} group by cf.investorId`;
      const totalEquityLLCInvestment = `select sum(cf.amount) as totalInvestedAmount, sum(c.applicationFee + ht.applicationFee) as totalFee, sum(cf.amount + c.applicationFee + ht.applicationFee) as totalInvestedWithFee 
                                        from campaignFunds as cf
                                        join charges as c on (cf.chargeId=c.chargeId)
                                        join campaigns as ca on cf.campaignId = ca.campaignId
                                        join hybridTransactions as ht on ht.campaignFundId = cf.campaignFundId
                                        where ${EquityLLCQuery} group by cf.investorId`;

      const [
        totalInvested,
        totalRepaid,
        nextPayments,
        projectionsResults,
        debtInvestments,
        equityInvestments,
        principleForgivenAmountResults,
        revShareInvestment,
        convertibleNoteInvestment,
        safeInvestment,
        safeDiscountInvestment,
        equityLLCInvestment,
      ] = await Promise.all([
        sequelize.query(totalInvestedQuery, {
          type: Sequelize.QueryTypes.SELECT,
        }),
        sequelize.query(totalRepaidQuery, {
          type: Sequelize.QueryTypes.SELECT,
        }),
        sequelize.query(nextPaymentsDateAndAmountQuery, {
          type: Sequelize.QueryTypes.SELECT,
        }),
        sequelize.query(totalProjectionResultsQuery, {
          type: Sequelize.QueryTypes.SELECT,
        }),
        sequelize.query(totalDebtInvestment, {
          type: Sequelize.QueryTypes.SELECT,
        }),
        sequelize.query(totalEquityInvestment, {
          type: Sequelize.QueryTypes.SELECT,
        }),
        sequelize.query(principleForgivenAmountQuery, {
          type: Sequelize.QueryTypes.SELECT,
        }),
        sequelize.query(totalRevShareInvestment, {
          type: Sequelize.QueryTypes.SELECT,
        }),
        sequelize.query(totalConvertibleNoteInvestment, {
          type: Sequelize.QueryTypes.SELECT,
        }),
        sequelize.query(totalSafeInvestment, {
          type: Sequelize.QueryTypes.SELECT,
        }),
        sequelize.query(totalSafeDiscountInvestment, {
          type: Sequelize.QueryTypes.SELECT,
        }),
        sequelize.query(totalEquityLLCInvestment, {
          type: Sequelize.QueryTypes.SELECT,
        }),
      ]);
      const amount = (item) => item.total;
      const sum = (prev, next) => prev + next;

      return {
        totalInvested:
          totalInvested.length > 0 ? totalInvested[0].totalInvestedWithFee : 0,
        totalInvestedWithoutFee:
          totalInvested.length > 0 ? totalInvested[0].totalInvestedAmount : 0,
        totalRepaid: totalRepaid.length > 0 ? totalRepaid[0].totalRepaid : 0,
        nextPaymentDate:
          nextPayments.length > 0
            ? Math.round(getDuration(nextPayments[0].nextPaymentDate, 'days') as number)
            : 0,
        nextPaymentAmount: nextPayments.length > 0 ? nextPayments[0].totalAmount : 0,
        projectionReturns:
          projectionsResults.length > 0 ? projectionsResults.map(amount).reduce(sum) : 0,
        totalPrinciple: totalRepaid.length > 0 ? totalRepaid[0].totalPrincipal : 0,
        totalDebtInvested:
          debtInvestments.length > 0 ? debtInvestments[0].totalInvestedAmount : 0,
        totalEquityInvested:
          equityInvestments.length > 0 ? equityInvestments[0].totalInvestedAmount : 0,
        principleForgivenAmount:
          principleForgivenAmountResults.length > 0
            ? principleForgivenAmountResults[0].forgivenAmount
            : 0,
        totalRevShareInvested:
          revShareInvestment.length > 0 ? revShareInvestment[0].totalInvestedAmount : 0,
        totalConvertibleNoteInvested:
          convertibleNoteInvestment.length > 0
            ? convertibleNoteInvestment[0].totalInvestedAmount
            : 0,
        totalSafeInvested:
          safeInvestment.length > 0 ? safeInvestment[0].totalInvestedAmount : 0,
        totalSafeDiscountInvested:
          safeDiscountInvestment.length > 0
            ? safeDiscountInvestment[0].totalInvestedAmount
            : 0,
        totalEquityLLCInvested:
          equityLLCInvestment.length > 0 ? equityLLCInvestment[0].totalInvestedAmount : 0,
      };
    } catch (err) {
      throw new DatabaseError(err.message);
    }
  }

  async fetchInvestorCampaignPortfolio(
    investorId: string,
    campaignId: string,
    entityId: string,
  ) {
    let totalInvestedwhereClause = `where cf.investorId='${investorId}' and cf.campaignId='${campaignId}' and (c.chargeStatus='success' OR chargeStatus='pending') and c.refundRequestDate is null and cf.deletedAt is null`;
    let totalRepaidWhereClause = `where investorId='${investorId}' and campaignId='${campaignId}'`;
    let projectionReturnWhereClause = `WHERE ip.investorId = '${investorId}' AND ip.campaignId = '${campaignId}'`;
    let defaultWhereClause = `WHERE
    r.investorId = '${investorId}'
    AND r.campaignId = '${campaignId}'
   `;
    if (entityId !== null) {
      totalInvestedwhereClause += ` and cf.entityId='${entityId}'`;
      totalRepaidWhereClause += ` and entityId='${entityId}'`;
      projectionReturnWhereClause += ` and ip.entityId = '${entityId}'`;
      defaultWhereClause += ` and r.entityId = '${entityId}'`;
    } else {
      totalInvestedwhereClause += ` and cf.entityId is null`;
      totalRepaidWhereClause += ` and entityId is null`;
      projectionReturnWhereClause += ` and ip.entityId is null`;
      defaultWhereClause += ` and r.entityId is null`;
    }
    try {
      const totalInvestedQuery = `select cf.investorId,cf.campaignId, sum(cf.amount) as totalInvestedAmount, sum(c.applicationFee) as totalFee, sum(cf.amount + c.applicationFee) as totalInvestedWithFee 
      from campaignFunds as cf
      join charges as c on (cf.chargeId=c.chargeId)
      left join (select distinct campaignFundId,applicationFee from hybridTransactions) ht on ht.campaignFundId = cf.campaignFundId
      ${totalInvestedwhereClause} group by cf.investorId,cf.campaignId;`;
      const totalRepaidQuery = `select sum(total) as totalRepaid ,sum(principle) as totalPrincipal, sum(interest) as totalInterest
      from repayments  
      ${totalRepaidWhereClause};`;
      const totalProjectionResultsQuery = `SELECT
      pr.investorPaymentsId,
      sum(pr.principle) AS totalPrinciple,
      sum(pr.interest) AS totalInterest,
      sum(pr.principle + pr.interest) AS total
    FROM
      investorPayments AS ip
      JOIN projectionReturns AS pr ON (pr.investorPaymentsId = ip.investorPaymentsId)
      ${projectionReturnWhereClause}
    GROUP BY
      pr.investorPaymentsId;`;

      const defaultProjectionResultQuery = `SELECT
      r.repaymentId,
      sum(r.principle) AS totalPrinciple,
      sum(r.interest) AS totalInterest,
      sum(r.principle + r.interest) AS total
      FROM
          repayments AS r
      ${defaultWhereClause}
      GROUP BY
          r.repaymentId`;
      const principleForgivenAmountQuery = `select 
          sum(principleForgivenAmount) as forgivenAmount 
        from 
          campaignPrincipleForgivens 
        where 
          campaignId='${campaignId}' and investorId='${investorId}' group by investorId`;
      const [
        totalInvested,
        totalRepaid,
        projectionsResults,
        defaultProjectionResults,
        principleForgivenAmountResults,
      ] = await Promise.all([
        sequelize.query(totalInvestedQuery, {
          type: Sequelize.QueryTypes.SELECT,
        }),
        sequelize.query(totalRepaidQuery, {
          type: Sequelize.QueryTypes.SELECT,
        }),
        sequelize.query(totalProjectionResultsQuery, {
          type: Sequelize.QueryTypes.SELECT,
        }),
        sequelize.query(defaultProjectionResultQuery, {
          type: Sequelize.QueryTypes.SELECT,
        }),
        sequelize.query(principleForgivenAmountQuery, {
          type: Sequelize.QueryTypes.SELECT,
        }),
      ]);

      const amount = (item) => item.total;
      const sum = (prev, next) => prev + next;

      return {
        totalInvestedWithFee:
          totalInvested.length > 0 ? totalInvested[0].totalInvestedWithFee : 0,
        totalInvestedWithoutFee:
          totalInvested.length > 0 ? totalInvested[0].totalInvestedAmount : 0,
        totalRepaid: totalRepaid.length > 0 ? totalRepaid[0].totalRepaid : 0,
        projectionReturns:
          projectionsResults.length > 0 ? projectionsResults.map(amount).reduce(sum) : 0,
        defaultProjectionResults:
          defaultProjectionResults.length > 0
            ? defaultProjectionResults.map(amount).reduce(sum)
            : 0,
        principle: totalRepaid.length > 0 ? totalRepaid[0].totalPrincipal : 0,
        interest: totalRepaid.length > 0 ? totalRepaid[0].totalInterest : 0,
        applicationFee: totalInvested.length > 0 ? totalInvested[0].totalFee : 0,
        principleForgivenAmount:
          principleForgivenAmountResults.length > 0
            ? principleForgivenAmountResults[0].forgivenAmount
            : 0,
      };
    } catch (err) {
      throw new DatabaseError(err.message);
    }
  }

  async fetchAllInvestorPaymentsByCampaignId(campaignId: string) {
    try {
      const all = await InvestorPaymentsModel.findAll({
        where: {
          campaignId,
        },
      });
      return all.map((investorPayment) => {
        return InvestorPayments.createFromObject(investorPayment);
      });
    } catch (err) {
      throw new DatabaseError(err.message);
    }
  }
  async deleteProjectionReturns(campaignId: string, lastPaymentDate: any) {
    try {
      const investorPayments = await this.fetchAllInvestorPaymentsByCampaignId(
        campaignId,
      );

      if (investorPayments.length > 0) {
        async.eachSeries(investorPayments, async (investorPayment: any) => {
          let whereCondition = {};
          if (lastPaymentDate !== null) {
            whereCondition = {
              investorPaymentsId: investorPayment.investorPaymentsId,
              createdAt: {
                [Op.gt]: moment(lastPaymentDate).format('YYYY-MM-DD HH:mm:ss'),
              },
            };
          } else {
            whereCondition = {
              investorPaymentsId: investorPayment.investorPaymentsId,
            };
          }

          await ProjectionReturnsModel.destroy({
            where: whereCondition,
          });
        });
      }
      return true;
    } catch (err) {
      throw new DatabaseError(err.message);
    }
  }

  async fetchAllInvestorPaymentsByCampaignIds(campaignIds: string[]) {
    try {
      return InvestorPaymentsModel.findAll({
        where: {
          campaignId: {
            [Op.in]: campaignIds,
          }
        },
      })
    } catch (error) {
      throw new DatabaseError(error.message);
    }
  }

  async deleteInvestorPaymentsByIds(investorPaymentsIds: string[]){
    try {
      return InvestorPaymentsModel.destroy({
        where: {
          investorPaymentsId: {
            [Op.in]: investorPaymentsIds,
          }
        },
        force: true,
      })
    } catch (error) {
      throw new DatabaseError(error.message);
    }
  }
}
export default InvestorPaymentsRepository;
