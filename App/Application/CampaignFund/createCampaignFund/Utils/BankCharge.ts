import TransactionType from '@domain/Core/CampaignFunds/TransactionType';
import HybridTransaction from '@domain/Core/HybridTransactions/HybridTransaction';
import {
  IHybridTransactionRepoistory,
  IHybridTransactionRepoistoryId,
} from '@domain/Core/HybridTransactions/IHybridTransactionRepository';
import { CampaignEscrow } from '@domain/Core/ValueObjects/CampaignEscrow';
import config from '@infrastructure/Config';
import HttpError from '@infrastructure/Errors/HttpException';
import {
  northCapitalService,
  usaepayService,
} from '@infrastructure/Service/PaymentProcessor';
import {
  ISlackService,
  ISlackServiceId,
} from '@infrastructure/Service/Slack/ISlackService';
import { inject, injectable } from 'inversify';
import moment from 'moment';
import { IBankCharge } from './IBankCharge';
import {
  ICampaignFundRepository,
  ICampaignFundRepositoryId,
} from '@domain/Core/CampaignFunds/ICampaignFundRepository';

const { slackConfig } = config;

@injectable()
class BankCharge implements IBankCharge {
  constructor(
    @inject(IHybridTransactionRepoistoryId)
    private hybridTransactionRepository: IHybridTransactionRepoistory,
    @inject(ISlackServiceId) private slackService: ISlackService,
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
    honeycombFee,
  }) => {
    let transferId = null;
    let referenceNumber;

    if (campaign.escrowType === CampaignEscrow.NC_BANK) {
      transferId = await northCapitalService.createTrade({
        offeringId: campaign.OfferingId(),
        accountId: user.NcAccountId(),
        transactionType: TransactionType.ACH().getValue(),
        transactionUnits: transactionAmount.toFixed(2),
        createdIpAddress: dto.Ip(),
      });
    } else {
      const bank = {
        routingNumber: paymentOption.getBank().getRoutingNumber(),
        accountNumber: paymentOption.getBank().getAccountNumber(),
        accountType: paymentOption.getBank().getAccountType(),
        token: paymentOption.getBank().getToken(),
      };

      const response = await usaepayService.externalFundMovement(
        campaign,
        amountToCharge,
        user.firstName,
        user.lastName,
        user.investor.vcCustomerKey,
        user.investor.vcThreadBankCustomerKey,
        bank,
      );

      transferId = response.tradeId;
      referenceNumber = response.referenceNumber;
    }

    if (transferId === null) {
      throw new HttpError(400, 'TradeId cannot be null');
    }

    if (paymentOption.isBank()) {
      try {
        if (campaign.escrowType === CampaignEscrow.NC_BANK) {
          referenceNumber = await northCapitalService.externalFundMove({
            accountId: user.NcAccountId(),
            tradeId: transferId,
            offeringId: campaign.OfferingId(),
            ip: dto.Ip(),
            amount: amountToCharge,
            NickName: `${paymentOption.getBank().getAccountType()} account`,
            description: `investment in ${
              campaign.campaignName
            } with id ${campaign.OfferingId()}`,
            checkNumber: transferId,
          });
        }
      } catch (error) {
        if (campaign.escrowType === CampaignEscrow.NC_BANK) {
          await northCapitalService.deleteTrade(user.NcAccountId(), transferId);
        }
        await this.slackService.publishMessage({
          message: `${user.email} received error *${JSON.stringify(
            error.message,
          )}* while investing *${transactionAmount.toFixed(2)}* in *${
            campaign.campaignName
          }* at ${moment().format('YYYY-MM-DD HH:mm:ss')}`,
          slackChannelId: slackConfig.INVESTMENT_ERROR.ID,
        });
        throw new Error(error);
      }
    }

    if (transferId) {
      const hybridBankTransaction = HybridTransaction.createFromDetails({
        amount: dto.canAvailPromotionCredits()
          ? transactionAmount + dto.PromotionAmount()
          : transactionAmount,
        transactionType: TransactionType.ACH().getValue(),
        tradeId: transferId,
        refrenceNumber: referenceNumber,
        dwollaTransactionId: null,
        individualACHId: null,
        applicationFee: honeycombFee,
        status: 'pending',
        source: campaign.escrowType,
      });

      hybridBankTransaction.setCampaignFundId(campaignFund.CampaignFundId());

      await this.hybridTransactionRepository.add(hybridBankTransaction);
    }

    return { referenceNumber, transferId };
  };
}

export default BankCharge;
