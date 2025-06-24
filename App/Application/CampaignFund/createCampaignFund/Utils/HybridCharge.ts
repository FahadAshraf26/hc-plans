import { IHybridCharge } from './IHybridCharge';
import { injectable, inject } from 'inversify';
import {
  northCapitalService,
  usaepayService,
} from '@infrastructure/Service/PaymentProcessor';
import HybridTransaction from '@domain/Core/HybridTransactions/HybridTransaction';
import TransactionType from '@domain/Core/CampaignFunds/TransactionType';
import HttpError from '@infrastructure/Errors/HttpException';
import {
  ISlackServiceId,
  ISlackService,
} from '@infrastructure/Service/Slack/ISlackService';
import {
  IHybridTransactionRepoistory,
  IHybridTransactionRepoistoryId,
} from '@domain/Core/HybridTransactions/IHybridTransactionRepository';
import config from '@infrastructure/Config';
import {
  ITransactionsHistoryRepository,
  ITransactionsHistoryRepositoryId,
} from '@domain/Core/TransactionsHistory/ITransactionsHistoryRepository';
import moment from 'moment';
import TransactionsHistory from '@domain/Core/TransactionsHistory/TransactionsHistory';
import { CampaignEscrow } from '@domain/Core/ValueObjects/CampaignEscrow';
import {
  ICampaignFundRepository,
  ICampaignFundRepositoryId,
} from '@domain/Core/CampaignFunds/ICampaignFundRepository';

const { slackConfig, dwolla } = config;

@injectable()
class HybridCharge implements IHybridCharge {
  constructor(
    @inject(ISlackServiceId) private slackService: ISlackService,
    @inject(IHybridTransactionRepoistoryId)
    private hybridTransactionRepository: IHybridTransactionRepoistory,
    @inject(ITransactionsHistoryRepositoryId)
    private transactionHistoryRepository: ITransactionsHistoryRepository,
    @inject(ICampaignFundRepositoryId)
    private campaignFundRepository: ICampaignFundRepository,
  ) {}

  execute = async ({
    dto,
    campaign,
    user,
    paymentOption,
    transactionAmount,
    campaignFund,
    honeycombFee,
    walletBalance,
    honeycombDwollaCustomer,
    dwollaService,
  }) => {
    let bankAmount = transactionAmount - walletBalance.balance.value;
    let amountToCharge = bankAmount + honeycombFee;
    let transferId = null;
    let referenceNumber;

    const sourceId = honeycombDwollaCustomer.getDwollaBalanceId();

    const reInvestmentDestination = {
      [CampaignEscrow.NC_BANK]: dwolla.dwolla.DWOLLA_RE_INVESTMENT_ID,
      [CampaignEscrow.FIRST_CITIZEN_BANK]:
        dwolla.dwolla.DWOLLA_RE_INVESTMENT_ID_FIRST_CITIZEN,
      [CampaignEscrow.THREAD_BANK]: dwolla.dwolla.DWOLLA_RE_INVESTMENT_ID_THREAD_BANK,
    };

    const destinationId = reInvestmentDestination[campaign.escrowType];

    const transactionId = await dwollaService.createTransfer({
      sourceId,
      destinationId,
      amount: walletBalance.balance.value,
      fee: 0,
      sameDayACH: false,
      idempotencyKey: undefined,
    });
    if (transactionId === null) {
      throw new HttpError(400, 'Dwolla transaction failed');
    }

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
          message: `${user.email} received error *${
            error.message
          }* while investing *${transactionAmount.toFixed(2)}* in *${
            campaign.campaignName
          }* at ${moment().format('YYYY-MM-DD HH:mm:ss')}`,
          slackChannelId: slackConfig.INVESTMENT.ID,
        });
        throw new Error(error);
      }
    }

    if (transferId && transactionId) {
      const hybridBankTransaction = HybridTransaction.createFromDetails({
        amount: dto.canAvailPromotionCredits()
          ? bankAmount + dto.PromotionAmount()
          : bankAmount,
        transactionType: TransactionType.Hybrid().getValue(),
        tradeId: transferId,
        refrenceNumber: referenceNumber,
        dwollaTransactionId: transactionId,
        individualACHId: null,
        applicationFee: honeycombFee,
        status: 'pending',
        walletAmount: walletBalance.balance.value,
        source: campaign.escrowType,
      });

      hybridBankTransaction.setCampaignFundId(campaignFund.CampaignFundId());
      await this.hybridTransactionRepository.add(hybridBankTransaction);
      const { status } = await dwollaService.retrieveTransfer(transactionId);
      const transactionHistory = TransactionsHistory.createFromDetail({
        cashFlowStatus: `Invested in ${campaign.campaignName}`,
        dwollaTransferId: transactionId,
        campaign: campaign.campaignName,
        userId: user.userId,
        amount: walletBalance.balance.value,
        transferStatus: status,
      });
      await this.transactionHistoryRepository.add(transactionHistory);
    }

    return { referenceNumber, transferId };
  };
}

export default HybridCharge;
