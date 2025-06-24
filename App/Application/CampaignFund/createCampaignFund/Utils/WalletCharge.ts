import TransactionsHistory from '@domain/Core/TransactionsHistory/TransactionsHistory';
import { IDwollaService, IDwollaServiceId } from '@infrastructure/Service/IDwollaService';
import { inject, injectable } from 'inversify';
import {
  IHoneycombDwollaCustomerRepository,
  IHoneycombDwollaCustomerRepositoryId,
} from '@domain/Core/HoneycombDwollaCustomer/IHoneycombDwollaCustomerRepository';
import {
  IHybridTransactionRepoistory,
  IHybridTransactionRepoistoryId,
} from '@domain/Core/HybridTransactions/IHybridTransactionRepository';
import HybridTransaction from '@domain/Core/HybridTransactions/HybridTransaction';
import TransactionType from '@domain/Core/CampaignFunds/TransactionType';
import { IWalletCharge } from './IWalletCharge';
import {
  ITransactionsHistoryRepository,
  ITransactionsHistoryRepositoryId,
} from '@domain/Core/TransactionsHistory/ITransactionsHistoryRepository';
import { northCapitalService } from '@infrastructure/Service/PaymentProcessor';
import config from '@infrastructure/Config';
import HttpError from '@infrastructure/Errors/HttpException';
import { CampaignEscrow } from '@domain/Core/ValueObjects/CampaignEscrow';
import {
  ICampaignFundRepository,
  ICampaignFundRepositoryId,
} from '@domain/Core/CampaignFunds/ICampaignFundRepository';

const { dwolla } = config;

@injectable()
class WalletCharge implements IWalletCharge {
  constructor(
    @inject(IDwollaServiceId) private dwollaService: IDwollaService,
    @inject(IHoneycombDwollaCustomerRepositoryId)
    private honeycombDwollaCustomer: IHoneycombDwollaCustomerRepository,
    @inject(IHybridTransactionRepoistoryId)
    private hybridTransactionRepository: IHybridTransactionRepoistory,
    @inject(ITransactionsHistoryRepositoryId)
    private transactionHistoryRepository: ITransactionsHistoryRepository,
    @inject(ICampaignFundRepositoryId)
    private campaignFundRepository: ICampaignFundRepository,
  ) {}
  execute = async ({
    user,
    walletAmount,
    campaignFund,
    campaign,
    paymentOption,
    dto,
  }) => {
    const honeycombDwollaCustomer = await this.honeycombDwollaCustomer.fetchByCustomerTypeAndUser(
      user.userId,
      'Personal',
    );
    let transferId = null;
    const source =
      campaign.escrowType === CampaignEscrow.NC_BANK
        ? CampaignEscrow.NC_BANK
        : campaign.escrowType;
    if (campaign.escrowType === CampaignEscrow.NC_BANK) {
      transferId = await northCapitalService.createTrade({
        offeringId: campaign.OfferingId(),
        accountId: user.NcAccountId(),
        transactionType: TransactionType.Wallet().getValue(),
        transactionUnits: walletAmount,
        createdIpAddress: dto.Ip(),
      });
      if (transferId === null) {
        throw new HttpError(400, 'TradeId cannot be null');
      }
    }

    const sourceId = honeycombDwollaCustomer.getDwollaBalanceId();

    const reInvestmentDestination = {
      [CampaignEscrow.NC_BANK]: dwolla.dwolla.DWOLLA_RE_INVESTMENT_ID,
      [CampaignEscrow.FIRST_CITIZEN_BANK]:
        dwolla.dwolla.DWOLLA_RE_INVESTMENT_ID_FIRST_CITIZEN,
      [CampaignEscrow.THREAD_BANK]: dwolla.dwolla.DWOLLA_RE_INVESTMENT_ID_THREAD_BANK,
    };

    const destinationId = reInvestmentDestination[campaign.escrowType];

    const transactionId = await this.dwollaService.createTransfer({
      sourceId,
      destinationId,
      amount: walletAmount,
      fee: 0,
      sameDayACH: false,
      idempotencyKey: undefined,
    });

    if (!transactionId) {
      throw new HttpError(400, 'transaction decleind');
    }
    if (
      campaign.escrowType === CampaignEscrow.FIRST_CITIZEN_BANK ||
      campaign.escrowType === CampaignEscrow.THREAD_BANK
    ) {
      transferId = transactionId;
    }
    const hybridWalletTransaction = HybridTransaction.createFromDetails({
      amount: dto.canAvailPromotionCredits()
        ? walletAmount + dto.PromotionAmount()
        : walletAmount,
      transactionType: TransactionType.Wallet().getValue(),
      tradeId: transferId,
      refrenceNumber: null,
      dwollaTransactionId: transactionId,
      individualACHId: null,
      applicationFee: 0,
      status: 'pending',
      walletAmount: 0,
      source,
    });
    hybridWalletTransaction.setCampaignFundId(campaignFund.CampaignFundId());
    await this.hybridTransactionRepository.add(hybridWalletTransaction);
    const { status } = await this.dwollaService.retrieveTransfer(transactionId);
    const transactionHistory = TransactionsHistory.createFromDetail({
      cashFlowStatus: `Invested in ${campaign.campaignName}`,
      dwollaTransferId: transactionId,
      campaign: campaign.campaignName,
      userId: user.userId,
      amount: walletAmount,
      transferStatus: status,
    });
    await this.transactionHistoryRepository.add(transactionHistory);

    return transferId;
  };
}

export default WalletCharge;
