import { injectable, inject } from 'inversify';
import { northCapitalService } from '@infrastructure/Service/PaymentProcessor';
import TransactionType from '@domain/Core/CampaignFunds/TransactionType';
import HttpError from '@infrastructure/Errors/HttpException';
import HybridTransaction from '@domain/Core/HybridTransactions/HybridTransaction';
import {
  IHybridTransactionRepoistory,
  IHybridTransactionRepoistoryId,
} from '@domain/Core/HybridTransactions/IHybridTransactionRepository';
import { ICardCharge } from './ICardCharge';
import {
  ISlackServiceId,
  ISlackService,
} from '@infrastructure/Service/Slack/ISlackService';
import config from '@infrastructure/Config';
import moment from 'moment';
import { CampaignEscrow } from '@domain/Core/ValueObjects/CampaignEscrow';
import {
  IStripeService,
  IStripeServiceId,
} from '@infrastructure/Service/Stripe/IStripeService';
import { toCents } from '@infrastructure/Utils/toCents';
import {
  ICampaignFundRepository,
  ICampaignFundRepositoryId,
} from '@domain/Core/CampaignFunds/ICampaignFundRepository';

const { slackConfig } = config;

@injectable()
class CardCharge implements ICardCharge {
  constructor(
    @inject(IHybridTransactionRepoistoryId)
    private hybridTransactionRepository: IHybridTransactionRepoistory,
    @inject(ISlackServiceId) private slackService: ISlackService,
    @inject(IStripeServiceId) private stripeService: IStripeService,
    @inject(ICampaignFundRepositoryId)
    private campaignFundRepository: ICampaignFundRepository,
  ) {}

  execute = async ({
    dto,
    campaign,
    user,
    paymentOption,
    amountToCharge,
    transactionAmount,
    campaignFund,
    fee,
    stripeFee,
  }) => {
    let transferId = null;
    let referenceNumber;
    const source =
      campaign.escrowType === CampaignEscrow.NC_BANK
        ? CampaignEscrow.NC_BANK
        : CampaignEscrow.STRIPE;
    if (campaign.escrowType === CampaignEscrow.NC_BANK) {
      transferId = await northCapitalService.createTrade({
        offeringId: campaign.OfferingId(),
        accountId: user.NcAccountId(),
        transactionType: TransactionType.CreditCard().getValue(),
        transactionUnits: transactionAmount.toFixed(2),
        createdIpAddress: dto.Ip(),
      });
    } else {
      const description = `investment in ${campaign.campaignName}`;
      let stripeAmount = toCents(amountToCharge);
      const response = await this.stripeService.externalFundMovement(
        stripeAmount,
        user.stripeCustomerId,
        description,
        campaign.campaignId,
        campaign.campaignName,
        user.stripePaymentMethodId,
        campaign.escrowType,
        stripeFee,
      );
      transferId = response.transactionId;
      referenceNumber = response.transactionId;
    }

    if (transferId === null) {
      throw new HttpError(400, 'TradeId cannot be null');
    }

    try {
      if (campaign.escrowType === CampaignEscrow.NC_BANK) {
        referenceNumber = await northCapitalService.ccFundMovement({
          accountId: user.NcAccountId(),
          tradeId: transferId,
          amount: amountToCharge,
          ip: dto.Ip(),
        });
      }
    } catch (error) {
      if (campaign.escrowType === CampaignEscrow.NC_BANK) {
        await northCapitalService.deleteTrade(user.NcAccountId(), transferId);
      }
      await this.slackService.publishMessage({
        message: `${user.email} received error *${
          error.message
        }* while investing *${transactionAmount.toFixed(2)}* in *${
          campaign.campaignName
        }* at ${moment().format('YYYY-MM-DD HH:mm:ss')}`,
        slackChannelId: slackConfig.INVESTMENT.ID,
      });
      throw new Error(error);
    }

    if (transferId) {
      const hybridBankTransaction = HybridTransaction.createFromDetails({
        amount: dto.canAvailPromotionCredits()
          ? transactionAmount + dto.PromotionAmount()
          : transactionAmount,
        transactionType: TransactionType.CreditCard().getValue(),
        tradeId: transferId,
        refrenceNumber: referenceNumber,
        dwollaTransactionId: null,
        individualACHId: null,
        applicationFee: fee,
        status: 'pending',
        source,
      });

      hybridBankTransaction.setCampaignFundId(campaignFund.CampaignFundId());

      await this.hybridTransactionRepository.add(hybridBankTransaction);
    }

    return { referenceNumber, transferId };
  };
}

export default CardCharge;
