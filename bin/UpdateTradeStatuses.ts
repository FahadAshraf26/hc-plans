import { ChargeStatus } from '@domain/Core/ValueObjects/ChargeStatus';
import { NorthCapitalStatus } from '@domain/Core/ValueObjects/NorthCapitalStatus';
import models from '@infrastructure/Model';
import { northCapitalService } from '@infrastructure/Service/PaymentProcessor';
import async from 'async';
import moment from 'moment';
import { CampaignEscrow } from '@domain/Core/ValueObjects/CampaignEscrow';

const { Sequelize, sequelize } = models;

export const UpdateTradeStatuses = async () => {
  const query = `select tradeId,campaignFundId from hybridTransactions hc where hc.status = "${ChargeStatus.PENDING}" and hc.source = '${CampaignEscrow.NC_BANK}'`;
  const response = await sequelize.query(query, {
    type: Sequelize.QueryTypes.SELECT,
  });
  let tradeStatus = ChargeStatus.PENDING;
  let refundRequestDate = null;
  let refunded = false;
  async.eachSeries(response, async (item) => {
    const result = await northCapitalService.getTradeStatus(item.tradeId);
    switch (result.orderStatus) {
      case NorthCapitalStatus.FUNDED:
      case NorthCapitalStatus.SUBMITTED:
      case NorthCapitalStatus.SETTLED:
        tradeStatus = ChargeStatus.SUCCESS;
        break;
      case NorthCapitalStatus.CANCELED:
        tradeStatus = ChargeStatus.CANCELLED;
        break;
      case NorthCapitalStatus.RETURNED:
        tradeStatus = ChargeStatus.FAILED;
        break;
      case NorthCapitalStatus.UNWINDPENDING:
        tradeStatus = ChargeStatus.PENDING_REFUND;
        refundRequestDate = moment.now();
        break;
      case NorthCapitalStatus.UNWINDSETTLED:
        refunded = true;
        tradeStatus = ChargeStatus.REFUNDED;
        break;
      case NorthCapitalStatus.UNWIND_PENDING:
        tradeStatus = ChargeStatus.PENDING_REFUND;
        refundRequestDate = moment.now();
        break;
      case NorthCapitalStatus.UNWIND_SETTLED:
        refunded = true;
        tradeStatus = ChargeStatus.REFUNDED;
        break;
      default:
        tradeStatus = ChargeStatus.PENDING;
        break;
    }

    const updateHybridTransactionQuery = `update hybridTransactions set status = "${tradeStatus}" where tradeId = "${item.tradeId}"`;
    await sequelize.query(updateHybridTransactionQuery, {
      type: Sequelize.QueryTypes.UPDATE,
    });

    const chargeQuery = `select chargeId from campaignFunds where campaignFundId = "${item.campaignFundId}"`;
    const [{ chargeId }] = await sequelize.query(chargeQuery, {
      type: Sequelize.QueryTypes.SELECT,
    });

    if (chargeId != null) {
      if (refundRequestDate != null) {
        const updateChargeQuery = `update charges set chargeStatus = "${tradeStatus}", refunded=${refunded}, refundRequestDate = "${refundRequestDate}" where chargeId = "${chargeId}"`;
        await sequelize.query(updateChargeQuery, {
          type: Sequelize.QueryTypes.UPDATE,
        });
      } else {
        const updateChargeQuery = `update charges set chargeStatus = "${tradeStatus}" where chargeId = "${chargeId}"`;
        await sequelize.query(updateChargeQuery, {
          type: Sequelize.QueryTypes.UPDATE,
        });
      }
    }
  });
};
