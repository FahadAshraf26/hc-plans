import {
  IHybridTransactionRepoistory,
  IHybridTransactionRepoistoryId,
} from '@domain/Core/HybridTransactions/IHybridTransactionRepository';
import {
  IChargeRepository,
  IChargeRepositoryId,
} from '@domain/Core/Charge/IChargeRepository';
import { inject, injectable } from 'inversify';
import {
  ICampaignFundRepository,
  ICampaignFundRepositoryId,
} from '@domain/Core/CampaignFunds/ICampaignFundRepository';
import Charge from '@domain/Core/Charge/Charge';
import { ChargeStatus } from '@domain/Core/ValueObjects/ChargeStatus';
import { ITransactionSaleSuccess } from './ITransactionSaleSuccess';

@injectable()
class TransactionSaleSuccess implements ITransactionSaleSuccess {
  constructor(
    @inject(IHybridTransactionRepoistoryId)
    private hybridTransactionRepository: IHybridTransactionRepoistory,
    @inject(IChargeRepositoryId) private chargeRepository: IChargeRepository,
    @inject(ICampaignFundRepositoryId)
    private campaignFundRepository: ICampaignFundRepository,
  ) {}

  async execute(event) {
    let tradeStatus = ChargeStatus.PENDING;
    const trade = await this.hybridTransactionRepository.fetchOneByCustomCritera({
      whereConditions: {
        tradeId: event.object.key,
      },
    });

    if (!trade) {
      return false;
    }
    tradeStatus =
      event.object.result === 'Approved' ? ChargeStatus.SUCCESS : ChargeStatus.FAILED;
    const campaignFund = await this.campaignFundRepository.fetchById(
      trade.getCampaignFundId(),
    );
    if (campaignFund) {
      const charge: Charge = await this.chargeRepository.fetchById(
        campaignFund.ChargeId(),
      );
      charge.setChargeStatus(tradeStatus);
      await this.chargeRepository.update(charge);
    }
    trade.status = tradeStatus;
    await this.hybridTransactionRepository.update(trade);
  }
}
export default TransactionSaleSuccess;
