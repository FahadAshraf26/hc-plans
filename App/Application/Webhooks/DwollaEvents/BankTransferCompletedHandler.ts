import { ITransactionsHistoryRepository } from '@domain/Core/TransactionsHistory/ITransactionsHistoryRepository';
import DwollaToBankTransactions from '@domain/Core/DwollaToBankTransactions/DwollaToBankTransactions';
import { IEntityIntermediaryRepository } from '@domain/Core/EntityIntermediary/IEntityIntermediayRepository';
import { ICampaignRepository } from '@domain/Core/Campaign/ICampaignRepository';
import { IUserRepository } from '@domain/Core/User/IUserRepository';
import { IDwollaPreTransactionsRepository } from '@domain/Core/DwollaPreTransactions/IDwollaPreTransactionsRepository';
import Repayments from '@domain/Core/Repayments/Repayments';
import { IDwollaPostTransactionsRepository } from '@domain/Core/DwollaPostTransactions/IDwollaPostTransactionsRepository';
import { IRepaymentsRepository } from '@domain/Core/Repayments/IRepaymentsRepository';
import { IDwollaService } from '@infrastructure/Service/IDwollaService';
import { IDwollaToBankTransactionsRepository } from '@domain/Core/DwollaToBankTransactions/IDwollaToBankTransactionsRepository';
import logger from '@infrastructure/Logger/logger';
import { IDwollaPostBankTransactionsRepository } from '@domain/Core/DwollaPostBankTransactions/IDwollaPostBankTransactionsRepository';

class BankTransferCompletedHandler {
  private event: any;
  private dwollaToBankTransactionsRepository: IDwollaToBankTransactionsRepository;
  private dwollaService: IDwollaService;
  private repaymentsRepository: IRepaymentsRepository;
  private dwollaPostTransactionsRepository: IDwollaPostTransactionsRepository;
  private dwollaPostBankTransactionsRepository: IDwollaPostBankTransactionsRepository;
  private dwollaPreTransactionRepository: IDwollaPreTransactionsRepository;
  private userRepository: IUserRepository;
  private campaignRepository: ICampaignRepository;
  private entityIntermediaryRepository: IEntityIntermediaryRepository;
  private transactionsHistoryRepository: ITransactionsHistoryRepository;

  constructor(
    event: any,
    dwollaToBankTransactionsRepository: IDwollaToBankTransactionsRepository,
    dwollaService: IDwollaService,
    repaymentsRepository: IRepaymentsRepository,
    dwollaPostTransactionsRepository: IDwollaPostTransactionsRepository,
    dwollaPostBankTransactionsRepository: IDwollaPostBankTransactionsRepository,
    dwollaPreTransactionRepository: IDwollaPreTransactionsRepository,
    userRepository: IUserRepository,
    campaignRepository: ICampaignRepository,
    entityIntermediaryRepository: IEntityIntermediaryRepository,
    transactionsHistoryRepository: ITransactionsHistoryRepository,
  ) {
    this.event = event;
    this.dwollaToBankTransactionsRepository = dwollaToBankTransactionsRepository;
    this.dwollaService = dwollaService;
    this.repaymentsRepository = repaymentsRepository;
    this.dwollaPostTransactionsRepository = dwollaPostTransactionsRepository;
    this.dwollaPostBankTransactionsRepository = dwollaPostBankTransactionsRepository;
    this.dwollaPreTransactionRepository = dwollaPreTransactionRepository;
    this.userRepository = userRepository;
    this.campaignRepository = campaignRepository;
    this.entityIntermediaryRepository = entityIntermediaryRepository;
    this.transactionsHistoryRepository = transactionsHistoryRepository;
  }

  async updateDwollaToBankTransactions(transferId, status) {
    const dwollaToBankTransactions = await this.dwollaToBankTransactionsRepository.getByTransactionId(
      transferId,
    );
    if (dwollaToBankTransactions !== null) {
      const dwollaToBankTransactionsObject = DwollaToBankTransactions.createFromObject(
        dwollaToBankTransactions,
      );
      const input = {
        ...dwollaToBankTransactionsObject,
        transferStatus: status,
      };
      return this.dwollaToBankTransactionsRepository.updateTransfer(input);
    } else {
      return false;
    }
  }

  async addRepayments(dwollaPostTransactionId) {
    let entityId = '';
    const dwollaPostTransaction = await this.dwollaPostTransactionsRepository.fetchById(
      dwollaPostTransactionId,
    );
    if (dwollaPostTransaction) {
      const dwollaPreTransaction = await this.dwollaPreTransactionRepository.fetchById(
        dwollaPostTransaction.dwollaPreTransactionId,
      );

      if (dwollaPreTransaction) {
        const user = await this.userRepository.fetchByEmail(
          dwollaPreTransaction.investorEmail,
          false,
        );

        const campaign = await this.campaignRepository.fetchOneByCustomCritera({
          whereConditions: { campaignName: dwollaPreTransaction.campaignName },
        });

        if (
          dwollaPreTransaction.entityName &&
          Object.keys(dwollaPreTransaction.entityName).length > 0
        ) {
          const entity = await this.entityIntermediaryRepository.fetchOneByCustomCritera({
            whereConditions: {
              entityName: dwollaPreTransaction.entityName,
            },
          });
          if (entity) {
            entityId = entity.entityIntermediaryId;
          }
        }

        const accountName =
          dwollaPostTransaction.destination === 'wallet' ||
          dwollaPostTransaction.destination === 'Wallet'
            ? 'Wallet'
            : 'Bank';
        const repaymentObject = Repayments.createFromDetail(
          dwollaPostTransaction.interestPaid,
          dwollaPostTransaction.principalPaid,
          dwollaPostTransaction.status,
          dwollaPostTransaction.destination === 'bank' ||
            dwollaPostTransaction.destination === 'Bank'
            ? 'ACH'
            : 'Wallet',
          dwollaPostTransaction.total,
          accountName,
          new Date(),
        );
        if (campaign) {
          repaymentObject.setCampaignId(campaign.campaignId);
        }
        if (user) {
          repaymentObject.setInvestorId(user.investor.investorId);
        }
        repaymentObject.setDwollaTransferId(dwollaPostTransaction.dwollaTransferId);
        if (entityId !== '') {
          repaymentObject.setEntityId(entityId);
        }
        repaymentObject.setUploadId(dwollaPreTransaction.uploadId);
        await this.repaymentsRepository.add(repaymentObject);
      }
    }
  }

  async updateDwollaPostTransactions(transferId, status) {
    const dwollaPostTransactions = await this.dwollaPostTransactionsRepository.fetchByTransferId(
      transferId,
    );

    if (dwollaPostTransactions !== null) {
      const input = {
        ...dwollaPostTransactions,
        status,
      };
      await this.dwollaPostTransactionsRepository.update(input, {
        dwollaTransferId: transferId,
      });
      return true;
      // await this.addRepayments(dwollaPostTransactions.getDwollaPostTransactionId());
    } else {
      return false;
    }
  }

  async updateRepayments(transferId, status) {
    const repayments = await this.repaymentsRepository.fetchByDwollaTransferId(
      transferId,
    );

    if (repayments !== null) {
      const repaymentObject = Repayments.createFromObject(repayments);
      const input = {
        ...repaymentObject,
        status: status === 'processed' ? 'Paid' : status,
      };

      await this.repaymentsRepository.update(input, {
        uploadId: repaymentObject.getUploadId(),
      });
      return true;
    } else {
      return false;
    }
  }

  async updatePostBankTransactions(transferId, status) {
    const dwollaPostBankTransactions = await this.dwollaPostBankTransactionsRepository.fetchByTransferId(
      transferId,
    );

    if (dwollaPostBankTransactions !== null) {
      const input = {
        ...dwollaPostBankTransactions,
        status,
      };
      await this.dwollaPostBankTransactionsRepository.update(input, {
        dwollaTransferId: transferId,
      });
      return true;
    } else {
      return false;
    }
  }
  async updateTransactionsHistory(transferId, status) {
    const transactionHistory = await this.transactionsHistoryRepository.fetchOneByCustomCritera(
      {
        whereConditions: { dwollaTransferId: transferId },
      },
    );

    if (transactionHistory) {
      const input = {
        ...transactionHistory,
        transferStatus: status,
      };
      await this.transactionsHistoryRepository.update(input, {
        dwollaTransferId: transferId,
      });
      return true;
    } else {
      return false;
    }
  }

  async execute() {
    try {
      const transferId = this.event.getResourceId();

      const { status } = await this.dwollaService.retrieveTransfer(transferId);
      await this.updateDwollaToBankTransactions(transferId, status);
      await this.updateDwollaPostTransactions(transferId, status);
      await this.updateRepayments(transferId, status);
      await this.updatePostBankTransactions(transferId, status);
      await this.updateTransactionsHistory(transferId, status);
      return true;
    } catch (error) {
      logger.error(error);
      return false;
    }
  }
}

export default BankTransferCompletedHandler;
