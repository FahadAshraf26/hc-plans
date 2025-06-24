import {
  ICampaignFundRepository,
  ICampaignFundRepositoryId,
} from '@domain/Core/CampaignFunds/ICampaignFundRepository';
import { inject, injectable } from 'inversify';
import UserTransactionHistoryDTO from './UserTransactionHistoryDTO';
import { IUserTransactionHistoryUsecase } from './IUserTransactionHistoryUsecase';
import { ChargeStatus } from '@domain/Core/ValueObjects/ChargeStatus';
import {
  IRepaymentsRepository,
  IRepaymentsRepositoryId,
} from '@domain/Core/Repayments/IRepaymentsRepository';
import { CampaignStage } from '@domain/Core/ValueObjects/CampaignStage';
import {
  ITransactionsHistoryRepository,
  ITransactionsHistoryRepositoryId,
} from '@domain/Core/TransactionsHistory/ITransactionsHistoryRepository';
import { IUserRepository, IUserRepositoryId } from '@domain/Core/User/IUserRepository';
@injectable()
class UserTransactionHistoryHistoryUsecase implements IUserTransactionHistoryUsecase {
  constructor(
    @inject(ICampaignFundRepositoryId)
    private campaignFundRepository: ICampaignFundRepository,
    @inject(IRepaymentsRepositoryId) private repaymentRepository: IRepaymentsRepository,
    @inject(ITransactionsHistoryRepositoryId)
    private transactionHistoryRepository: ITransactionsHistoryRepository,
    @inject(IUserRepositoryId) private userRepository: IUserRepository,
  ) {}

  async execute(userTransactionHistoryDTO: UserTransactionHistoryDTO) {
    const investorId = userTransactionHistoryDTO.getInvestorId();
    const entityId = userTransactionHistoryDTO.getEntityId();
    const user = await this.userRepository.fetchByInvestorId(investorId);
    let transactionHistory = [];
    const campaignFunds = await this.campaignFundRepository.fetchAllByInvestorId(
      investorId,
      entityId,
    );

    const repayments = await this.repaymentRepository.fetchByInvestor(
      investorId,
      entityId,
    );

    const transactionHistoryLogs = await this.transactionHistoryRepository.getAllInvestorTransafers(
      user.userId,
    );
    if (transactionHistoryLogs.length) {
      const transferToBankLogs = transactionHistoryLogs.filter((item) =>
        item.cashFlowStatus.includes('Cash Out'),
      );
      if (transferToBankLogs.length) {
        transferToBankLogs.map((transactionLog) => {
          const transferToBankObj = {
            title: `Transfer to bank`,
            createdAt: transactionLog.createdAt,
            transactionType: `to bank`,
            status:
              transactionLog.transferStatus === 'processed' ? 'Completed' : 'Pending',
            amount: transactionLog.amount,
          };
          transactionHistory.push(transferToBankObj);
        });
      }
    }

    if (repayments) {
      repayments.map((repayment) => {
        const repaymentObj = {
          title: `Repayment - ${repayment.campaignName}`,
          createdAt: repayment.createdAt,
          amount: repayment.total,
          transactionType:
            repayment.paymentType.toLowerCase() === 'ach' ||
            repayment.paymentType.toLowerCase() === 'bank'
              ? 'to bank'
              : 'to wallet',
          status: 'Completed',
        };
        transactionHistory.push(repaymentObj);
      });
    }

    if (campaignFunds) {
      campaignFunds.map((campaignFund) => {
        const refundStatus =
          campaignFund.Charge().chargeStatus === ChargeStatus.REFUNDED ||
          campaignFund.Charge().chargeStatus === ChargeStatus.CANCELLED;
        let campaignFundObj = {};

        let transactionTitle =
          refundStatus &&
          campaignFund.Campaign().campaignStage === CampaignStage.NOT_FUNDED
            ? `Refunded (Campaign Unsuccessful) - ${campaignFund.Campaign().campaignName}`
            : refundStatus
            ? `Refunded (Canceled Investment) - ${campaignFund.Campaign().campaignName}`
            : `Investment - ${campaignFund.Campaign().campaignName}`;

        if (campaignFund.IncludeWallet()) {
          const isWalletAndBank = campaignFund.hybridTransactions.length === 2;
          const isWallet =
            campaignFund.hybridTransactions.length === 1 &&
            campaignFund.hybridTransactions[0].transactionType.toLowerCase() === 'wallet'
              ? true
              : false;
          const isHybrid =
            campaignFund.hybridTransactions.length === 1 &&
            campaignFund.hybridTransactions[0].transactionType.toLowerCase() === 'hybrid'
              ? true
              : false;
          const isCreditCard =
            campaignFund.hybridTransactions.length === 1 &&
            campaignFund.hybridTransactions[0].transactionType.toLowerCase() ===
              'creditcard'
              ? true
              : false;
          const isApplePay =
            campaignFund.hybridTransactions.length === 1 &&
            campaignFund.hybridTransactions[0].transactionType.toLowerCase() ===
              'applepay'
              ? true
              : false;
          const isGooglePay =
            campaignFund.hybridTransactions.length === 1 &&
            campaignFund.hybridTransactions[0].transactionType.toLowerCase() ===
              'googlepay'
              ? true
              : false;
          let hybridTransactions = [];
          campaignFund.hybridTransactions.map((item) => {
            if (item.transactionType.toLowerCase() === 'hybrid') {
              let walletTransaction = {
                transactionType: 'from wallet',
                value: item.walletAmount,
              };
              let bankTransaction = {
                transactionType: 'from bank',
                value: item.amount,
              };
              hybridTransactions.push(walletTransaction);
              hybridTransactions.push(bankTransaction);
            } else {
              hybridTransactions.push({
                transactionType:
                  item.transactionType.toLowerCase() === 'ach'
                    ? 'from bank'
                    : item.transactionType.toLowerCase() === 'creditcard'
                    ? 'from credit card'
                    : item.transactionType.toLowerCase() === 'googlepay'
                    ? 'from google pay'
                    : item.transactionType.toLowerCase() === 'applepay'
                    ? 'from apple pay'
                    : 'from wallet',
                value: item.amount,
              });
            }
          });

          campaignFundObj = {
            title: transactionTitle,
            amount: campaignFund.Amount(),
            createdAt: campaignFund.CreatedAt(),
            transactionType: refundStatus
              ? 'to bank'
              : isWalletAndBank
              ? 'from wallet + bank'
              : isWallet
              ? 'from wallet'
              : isCreditCard
              ? 'from credit card'
              : isHybrid
              ? 'from wallet + bank'
              : isApplePay
              ? 'from apple pay'
              : isGooglePay
              ? 'from google pay'
              : 'from bank',
            hybridTransactions: isWalletAndBank || isHybrid ? hybridTransactions : [],
            status: campaignFund.hybridTransactions.find(
              (item) => item.status === 'pending' || item.status === null,
            )
              ? 'Pending'
              : 'Completed',
          };
        } else {
          campaignFundObj = {
            title: transactionTitle,
            amount: campaignFund.Amount(),
            createdAt: campaignFund.CreatedAt(),
            transactionType: refundStatus ? 'to bank' : 'from bank',
            status:
              campaignFund.Charge().chargeStatus.toLowerCase() === ChargeStatus.SUCCESS ||
              campaignFund.Charge().chargeStatus.toLowerCase() ===
                ChargeStatus.REFUNDED ||
              campaignFund.Charge().chargeStatus.toLowerCase() ===
                ChargeStatus.CANCELLED ||
              campaignFund.Charge().chargeStatus.toLowerCase() === ChargeStatus.FAILED
                ? 'Completed'
                : 'Pending',
          };
        }
        transactionHistory.push(campaignFundObj);
      });
    }

    return transactionHistory.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );
  }
}

export default UserTransactionHistoryHistoryUsecase;
