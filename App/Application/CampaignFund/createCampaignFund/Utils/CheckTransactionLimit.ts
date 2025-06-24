import TransactionType from '@domain/Core/CampaignFunds/TransactionType';
import {
  IGlobalHoneycombConfigurationRepository,
  IGlobalHoneycombConfigurationRepositoryId,
} from '@domain/Core/GlobalHoneycombConfiguration/IGlobalHoneycombConfigurationRepository';
import { inject, injectable } from 'inversify';
import { ICheckTransactionLimit } from './ICheckTransactionLimit';
import HttpError from '@infrastructure/Errors/HttpException';

@injectable()
class CheckTransactionLimit implements ICheckTransactionLimit {
  constructor( @inject(IGlobalHoneycombConfigurationRepositoryId)
  private globalHoneycombConfigurationRepository: IGlobalHoneycombConfigurationRepository,) { }
  
  async execute(dto,campaignFund) {
    const globalConfiguration = await this.globalHoneycombConfigurationRepository.fetchLatestRecord();
    const cardTransactionLimit = globalConfiguration.configuration[TransactionType.CreditCard().getValue()].transactionLimit;
    const bankTransactionLimit = globalConfiguration.configuration[TransactionType.ACH().getValue()].transactionLimit;
    const hybridTransactionLimit = globalConfiguration.configuration[TransactionType.Hybrid().getValue()].transactionLimit;
    const walletTransactionLimit = globalConfiguration.configuration[TransactionType.Wallet().getValue()].transactionLimit;
    
    if (dto.TransactionType() === TransactionType.CreditCard().getValue() && campaignFund.Amount() > cardTransactionLimit) {
      throw new HttpError(400,`You can only invest ${cardTransactionLimit} at a time`)
    } else if(dto.TransactionType() === TransactionType.ACH().getValue() && campaignFund.Amount() > bankTransactionLimit) {
      throw new HttpError(400,`You can only invest ${bankTransactionLimit} at a time`)
    } else if (dto.TransactionType() === TransactionType.Hybrid().getValue() && campaignFund.Amount() > hybridTransactionLimit) {
      throw new HttpError(400,`You can only invest ${hybridTransactionLimit} at a time`)
    } else if (dto.TransactionType() === TransactionType.Wallet().getValue() && campaignFund.Amount() > walletTransactionLimit) {
      throw new HttpError(400,`You can only invest ${walletTransactionLimit} at a time`)
    }
  }
}

export default CheckTransactionLimit;
