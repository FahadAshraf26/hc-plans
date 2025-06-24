import { IPaymentIntentCancelled } from './IPaymentIntentCancelled';
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
import { ChargeStatus } from '@domain/Core/ValueObjects/ChargeStatus';
import { injectable, inject } from 'inversify';

@injectable()
class PaymentIntentCancelled implements IPaymentIntentCancelled {
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
          tradeId: eventData.id,
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
          const newCharge = {
            ...charge,
            chargeStatus: ChargeStatus.CANCELLED,
          };
          await this.chargeRepository.update(newCharge);
        }
      }
      const newHybridTransaction = {
        ...hybridTransactions,
        status: ChargeStatus.CANCELLED,
      };
      await this.hybridTransactionRepository.update(newHybridTransaction);
    }
  }
}

export default PaymentIntentCancelled;
