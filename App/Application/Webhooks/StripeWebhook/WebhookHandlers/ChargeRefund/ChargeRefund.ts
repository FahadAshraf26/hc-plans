import {
  ICampaignFundRepository,
  ICampaignFundRepositoryId,
} from '@domain/Core/CampaignFunds/ICampaignFundRepository';
import {
  IChargeRepository,
  IChargeRepositoryId,
} from '@domain/Core/Charge/IChargeRepository';
import {
  IHybridTransactionRepoistory,
  IHybridTransactionRepoistoryId,
} from '@domain/Core/HybridTransactions/IHybridTransactionRepository';
import { inject, injectable } from 'inversify';
import { ChargeStatus } from '@domain/Core/ValueObjects/ChargeStatus';
import { IChargeRefund } from './IChargeRefund';
import Charge from '@domain/Core/Charge/Charge';

@injectable()
class ChargeRefund implements IChargeRefund {
  constructor(
    @inject(IHybridTransactionRepoistoryId)
    private hybridTransactionRepository: IHybridTransactionRepoistory,
    @inject(ICampaignFundRepositoryId)
    private campaignFundRepository: ICampaignFundRepository,
    @inject(IChargeRepositoryId) private chargeRepository: IChargeRepository,
  ) {}

  async execute(eventData) {
    const hybridTransactions = await this.hybridTransactionRepository.fetchOneByCustomCritera(
      {
        whereConditions: {
          tradeId: eventData.payment_intent,
        },
      },
    );
    if (hybridTransactions) {
      const campaignFund = await this.campaignFundRepository.fetchById(
        hybridTransactions.campaignFundId,
      );

      if (campaignFund) {
        const charge = await this.chargeRepository.fetchById(campaignFund.ChargeId());
        if (charge) {
          charge.setChargeStatus(ChargeStatus.REFUNDED);
          charge.setIsRefunded(true);
          await this.chargeRepository.update(charge);
        }
      }

      const newHybridTransaction = {
        ...hybridTransactions,
        status: ChargeStatus.REFUNDED,
      };
      await this.hybridTransactionRepository.update(newHybridTransaction);
    }
  }
}

export default ChargeRefund;
