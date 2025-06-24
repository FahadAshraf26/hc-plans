import { CampaignEscrow } from '@domain/Core/ValueObjects/CampaignEscrow';
import {
  IStripeService,
  IStripeServiceId,
} from '@infrastructure/Service/Stripe/IStripeService';
import { inject, injectable } from 'inversify';
import { IePayCharge } from './IePayCharge';
import HttpError from '@infrastructure/Errors/HttpException';
import {
  IHybridTransactionRepoistory,
  IHybridTransactionRepoistoryId,
} from '@domain/Core/HybridTransactions/IHybridTransactionRepository';
import HybridTransaction from '@domain/Core/HybridTransactions/HybridTransaction';
import {
  ICampaignFundRepository,
  ICampaignFundRepositoryId,
} from '@domain/Core/CampaignFunds/ICampaignFundRepository';
import { toCents } from '@infrastructure/Utils/toCents';

@injectable()
export class ePayCharge implements IePayCharge {
  constructor(
    @inject(IStripeServiceId) private stripeService: IStripeService,
    @inject(IHybridTransactionRepoistoryId)
    private hybridTransactionRepository: IHybridTransactionRepoistory,
    @inject(ICampaignFundRepositoryId)
    private campaignFundRepository: ICampaignFundRepository,
  ) {}

  execute = async ({
    campaign,
    user,
    amountToCharge,
    transactionAmount,
    campaignFund,
    fee,
    dto,
    stripeFee,
  }) => {
    let transferId: string, referenceNumber: string, clientSecret: string;
    if (
      campaign.escrowType === CampaignEscrow.FIRST_CITIZEN_BANK ||
      campaign.escrowType === CampaignEscrow.THREAD_BANK
    ) {
      const description = `investment in ${campaign.campaignName}`;
      const response = await this.stripeService.createPaymentIntentforEpay(
        toCents(amountToCharge),
        user.stripeCustomerId,
        description,
        campaign.campaignId,
        campaign.campaignName,
        campaign.escrowType,
        stripeFee,
      );

      transferId = response.id;
      referenceNumber = response.id;
      clientSecret = response.client_secret;
    }

    if (transferId === null) {
      throw new HttpError(400, 'TradeId cannot be null');
    }

    if (transferId) {
      const hybridBankTransaction = HybridTransaction.createFromDetails({
        amount: dto.canAvailPromotionCredits()
          ? transactionAmount + dto.PromotionAmount()
          : transactionAmount,
        transactionType: dto.TransactionType(),
        tradeId: transferId,
        refrenceNumber: referenceNumber,
        dwollaTransactionId: null,
        individualACHId: null,
        applicationFee: fee,
        status: 'pending',
        source: CampaignEscrow.STRIPE,
      });

      hybridBankTransaction.setCampaignFundId(campaignFund.CampaignFundId());

      await this.hybridTransactionRepository.add(hybridBankTransaction);
    }

    return { clientSecret, referenceNumber, transferId };
  };
}
