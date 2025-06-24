import {
  IHybridTransactionRepoistory,
  IHybridTransactionRepoistoryId,
} from '@domain/Core/HybridTransactions/IHybridTransactionRepository';
import {
  IChargeRepository,
  IChargeRepositoryId,
} from '@domain/Core/Charge/IChargeRepository';
import { inject, injectable } from 'inversify';

import { ChargeStatus } from '@domain/Core/ValueObjects/ChargeStatus';
import { NorthCapitalStatus } from '@domain/Core/ValueObjects/NorthCapitalStatus';
import { IUpdateTradeStatusWebhookHandler } from '@application/Webhooks/NorthCapital/webhookHandlers/updateTradeStatusWebhookHandler/IUpdateTradeStatusWebhookHandler';
import moment from 'moment';
import {
  ICampaignFundRepository,
  ICampaignFundRepositoryId,
} from '@domain/Core/CampaignFunds/ICampaignFundRepository';
import Charge from '@domain/Core/Charge/Charge';

@injectable()
class UpdateTradeStatusWebhookHandler implements IUpdateTradeStatusWebhookHandler {
  constructor(
    @inject(IChargeRepositoryId) private chargeRepository: IChargeRepository,
    @inject(IHybridTransactionRepoistoryId)
    private hybridTransactionRepository: IHybridTransactionRepoistory,
    @inject(ICampaignFundRepositoryId)
    private campaignFundRepository: ICampaignFundRepository,
  ) {}

  async execute(event) {
    await new Promise((r) => setTimeout(r, 5000));
    let tradeStatus = ChargeStatus.PENDING;
    let refunded = false;
    let refundRequestDate = null;

    let charge = await this.chargeRepository.fetchByDwollaChargeId(
      event.payload().tradeId,
    );

    switch (event.payload().orderStatus) {
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

    if (!charge) {
      const trade = await this.hybridTransactionRepository.fetchOneByCustomCritera({
        whereConditions: {
          tradeId: event.payload().tradeId,
        },
      });

      if (!trade) {
        return false;
      }
      const campaignFund = await this.campaignFundRepository.fetchById(
        trade.getCampaignFundId(),
      );
      if (campaignFund) {
        const charge: Charge = await this.chargeRepository.fetchById(
          campaignFund.ChargeId(),
        );
        charge.setChargeStatus(tradeStatus);
        charge.setIsRefunded(refunded);
        charge.setRefundRequestedDate(refundRequestDate);
        await this.chargeRepository.update(charge);
      }
      trade.status = tradeStatus;
      await this.hybridTransactionRepository.update(trade);
    } else {
      charge.setChargeStatus(tradeStatus);
      charge.setIsRefunded(refunded);
      charge.setRefundRequestedDate(refundRequestDate);
      await this.chargeRepository.update(charge);
    }

    return true;
  }
}

export default UpdateTradeStatusWebhookHandler;
