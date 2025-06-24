import TransactionsHistory from '@domain/Core/TransactionsHistory/TransactionsHistory';
import {
  ITransactionsHistoryRepository,
  ITransactionsHistoryRepositoryId,
} from '@domain/Core/TransactionsHistory/ITransactionsHistoryRepository';
import {
  IEntityIntermediaryRepositoryId,
  IEntityIntermediaryRepository,
} from '@domain/Core/EntityIntermediary/IEntityIntermediayRepository';
import {
  ICampaignRepositoryId,
  ICampaignRepository,
} from '@domain/Core/Campaign/ICampaignRepository';
import {
  IRepaymentsRepositoryId,
  IRepaymentsRepository,
} from '@domain/Core/Repayments/IRepaymentsRepository';
import {
  IIssuerBankRepositoryId,
  IIssuerBankRepository,
} from '@domain/Core/IssuerBank/IIssuerBankRepository';
import {
  IInvestorPaymentOptionsRepository,
  IInvestorPaymentOptionsRepositoryId,
} from '@domain/InvestorPaymentOptions/IInvestorPaymentOptionsRepository';
import { IDwollaServiceId, IDwollaService } from '@infrastructure/Service/IDwollaService';
import {
  IHoneycombDwollaCustomerRepositoryId,
  IHoneycombDwollaCustomerRepository,
} from '@domain/Core/HoneycombDwollaCustomer/IHoneycombDwollaCustomerRepository';
import { IUserRepositoryId, IUserRepository } from '@domain/Core/User/IUserRepository';
import {
  IIssuerRepositoryId,
  IIssuerRepository,
} from '@domain/Core/Issuer/IIssuerRepository';
import DwollaPostTransactions from '@domain/Core/DwollaPostTransactions/DwollaPostTransactions';
import { ICreatePostTransactionsUseCase } from './ICreatePostTransactionsUseCase';
import CreatePostTransactionsUseCaseDTO from '@application/DwollaPostTransactions/CreatePostTransactionsUseCase/CreatePostTransactionsUseCaseDTO';
import {
  IDwollaPostTransactionsRepositoryId,
  IDwollaPostTransactionsRepository,
} from '@domain/Core/DwollaPostTransactions/IDwollaPostTransactionsRepository';
import {
  IDwollaPreTransactionsRepositoryId,
  IDwollaPreTransactionsRepository,
} from '@domain/Core/DwollaPreTransactions/IDwollaPreTransactionsRepository';
import { injectable, inject } from 'inversify';
import async from 'async';
import uuid from 'uuid/v4';
import Repayments from '@domain/Core/Repayments/Repayments';
import RepaymentsUpdate from '@domain/Core/RepaymentsUpdate/RepaymentsUpdate';
import {
  IRepaymentsUpdateRepository,
  IRepaymentsUpdateRepositoryId,
} from '@domain/Core/RepaymentsUpdate/IRepaymentsUpdateRepository';

@injectable()
class CreatePostTransactionsUseCase implements ICreatePostTransactionsUseCase {
  constructor(
    @inject(IDwollaPreTransactionsRepositoryId)
    private dwollaPreTransactionRepository: IDwollaPreTransactionsRepository,
    @inject(IDwollaPostTransactionsRepositoryId)
    private dwollaPostTransactionsRepository: IDwollaPostTransactionsRepository,
    @inject(IIssuerRepositoryId) private issuerRepository: IIssuerRepository,
    @inject(IUserRepositoryId) private userRepository: IUserRepository,
    @inject(IHoneycombDwollaCustomerRepositoryId)
    private honeycombDwollaCustomerRepository: IHoneycombDwollaCustomerRepository,
    @inject(IDwollaServiceId) private dwollaSerivce: IDwollaService,
    @inject(IInvestorPaymentOptionsRepositoryId)
    private investorPaymentOptionsRepository: IInvestorPaymentOptionsRepository,
    @inject(IIssuerBankRepositoryId) private issuerBankRepository: IIssuerBankRepository,
    @inject(IRepaymentsRepositoryId) private repaymentRepository: IRepaymentsRepository,
    @inject(ICampaignRepositoryId) private campaignRepository: ICampaignRepository,
    @inject(IEntityIntermediaryRepositoryId)
    private entityIntermediaryRepository: IEntityIntermediaryRepository,
    @inject(ITransactionsHistoryRepositoryId)
    private transactionsHistoryRepository: ITransactionsHistoryRepository,
    @inject(IRepaymentsUpdateRepositoryId)
    private repaymentUpdateRepository: IRepaymentsUpdateRepository,
  ) {}

  async addTransactionHistory(
    cashFlowStatus: string,
    campaignName: string,
    userId: string,
    transferId: string,
    amount: number,
    transferStatus: string,
  ) {
    const transactionsHistory = TransactionsHistory.createFromDetail({
      cashFlowStatus,
      dwollaTransferId: transferId,
      campaignName,
      userId,
      amount,
      transferStatus,
    });

    await this.transactionsHistoryRepository.add(transactionsHistory);
  }

  async walletToWalletTransfer(
    dwollaPreTransaction,
    issuer,
    user,
    idempotencyId,
    campaign,
  ) {
    const dwollaBusinessCustomer = await this.honeycombDwollaCustomerRepository.fetchByIssuerId(
      issuer.issuerId,
    );

    const dwollaPersonalCustomer = await this.honeycombDwollaCustomerRepository.fetchByCustomerTypeAndUser(
      user.userId,
      'Personal',
    );

    const dwollaSourceBalanceId = dwollaBusinessCustomer.getDwollaBalanceId();
    const dwollaDestinationBalanceId = dwollaPersonalCustomer.getDwollaBalanceId();

    const transferId = await this.dwollaSerivce.createTransfer({
      sourceId: dwollaSourceBalanceId,
      destinationId: dwollaDestinationBalanceId,
      amount: dwollaPreTransaction.total,
      fee: 0,
      sameDayACH: false,
      idempotencyKey: idempotencyId,
    });
    const { status } = await this.dwollaSerivce.retrieveTransfer(transferId);
    await this.addTransactionHistory(
      'Cash In - Wallet',
      campaign.campaignName,
      user.userId,
      transferId,
      dwollaPreTransaction.total,
      status,
    );
    return transferId;
  }

  async walletToBankTransfer(
    dwollaPreTransaction,
    issuer,
    user,
    idempotencyId,
    campaign,
  ) {
    const dwollaBusinessCustomer = await this.honeycombDwollaCustomerRepository.fetchByIssuerId(
      issuer.issuerId,
    );

    const dwollaSourceBalanceId = dwollaBusinessCustomer.getDwollaBalanceId();

    const bank = await this.investorPaymentOptionsRepository.fetchInvestorBank(
      user.investor.investorId,
    );

    const dwollaDestinationId = bank.getBank().getDwollaFundingSourceId();
    const dwollaFee = await this.dwollaSerivce.createFee(
      dwollaPreTransaction.total,
      dwollaBusinessCustomer.getDwollaCustomerId(),
    );
    const transferId = await this.dwollaSerivce.createTransfer({
      sourceId: dwollaSourceBalanceId,
      destinationId: dwollaDestinationId,
      amount: dwollaPreTransaction.total,
      fee: dwollaFee,
      sameDayACH: false,
      idempotencyKey: idempotencyId,
    });
    const { status } = await this.dwollaSerivce.retrieveTransfer(transferId);
    await this.addTransactionHistory(
      'Check In',
      campaign.campaignName,
      user.userId,
      transferId,
      dwollaPreTransaction.total,
      status,
    );
    return transferId;
  }

  async bankToWalletTransfer(
    dwollaPreTransaction,
    issuer,
    user,
    idempotencyId,
    campaign,
  ) {
    const dwollaBusinessCustomer = await this.honeycombDwollaCustomerRepository.fetchByIssuerId(
      issuer.issuerId,
    );
    const issuerBanks = await this.issuerBankRepository.fetchAllBanksByIssuerId(
      issuer.issuerId,
    );

    const issuerBank = issuerBanks.find((item) => item.isForRepayment === true);
    const bank = await this.investorPaymentOptionsRepository.fetchInvestorBank(
      user.investor.investorId,
    );

    const dwollaDestinationId = bank.getBank().getDwollaFundingSourceId();

    const dwollaSourceBalanceId = issuerBank.dwollaSourceId;
    const dwollaFee = await this.dwollaSerivce.createFee(
      dwollaPreTransaction.total,
      dwollaBusinessCustomer.getDwollaCustomerId(),
    );

    const transferId = await this.dwollaSerivce.createTransfer({
      sourceId: dwollaSourceBalanceId,
      destinationId: dwollaDestinationId,
      amount: dwollaPreTransaction.total,
      fee: dwollaFee,
      sameDayACH: false,
      idempotencyKey: idempotencyId,
    });
    const { status } = await this.dwollaSerivce.retrieveTransfer(transferId);
    await this.addTransactionHistory(
      'Check In',
      campaign.campaignName,
      user.userId,
      transferId,
      dwollaPreTransaction.total,
      status,
    );

    return transferId;
  }

  async bankToBankTransfer(dwollaPreTransaction, issuer, user, idempotencyId, campaign) {
    const dwollaBusinessCustomer = await this.honeycombDwollaCustomerRepository.fetchByIssuerId(
      issuer.issuerId,
    );
    const issuerBanks = await this.issuerBankRepository.fetchAllBanksByIssuerId(
      issuer.issuerId,
    );

    const issuerBank = issuerBanks.find((item) => item.isForRepayment === true);
    const dwollaPersonalCustomer = await this.honeycombDwollaCustomerRepository.fetchByUserId(
      user.userId,
    );

    const dwollaSourceBalanceId = issuerBank.dwollaSourceId;
    const dwollaDestinationBalanceId = dwollaPersonalCustomer.getDwollaBalanceId();
    const dwollaFee = await this.dwollaSerivce.createFee(
      dwollaPreTransaction.total,
      dwollaBusinessCustomer.getDwollaCustomerId(),
    );
    const transferId = await this.dwollaSerivce.createTransfer({
      sourceId: dwollaSourceBalanceId,
      destinationId: dwollaDestinationBalanceId,
      amount: dwollaPreTransaction.total,
      fee: dwollaFee,
      sameDayACH: false,
      idempotencyKey: idempotencyId,
    });
    const { status } = await this.dwollaSerivce.retrieveTransfer(transferId);
    await this.addTransactionHistory(
      'Check In',
      campaign.campaignName,
      user.userId,
      transferId,
      dwollaPreTransaction.total,
      status,
    );

    return transferId;
  }

  async addDwollaPostTransactions(
    dwollaPostTransactionId,
    dwollaPreTransaction,
    idempotencyId,
    transferId,
    issuer,
  ) {
    const postTransactionInput = {
      dwollaPostTransactionId,
      source: dwollaPreTransaction.source,
      destination: dwollaPreTransaction.destination,
      interestPaid: dwollaPreTransaction.interestPaid,
      principalPaid: dwollaPreTransaction.principalPaid,
      total: dwollaPreTransaction.total,
      status: 'pending',
      idempotencyId,
      dwollaTransferId: transferId,
      fileName: dwollaPreTransaction.fileName,
    };

    const dwollaPostTransactionObject = DwollaPostTransactions.createFromDetail(
      postTransactionInput,
    );
    dwollaPostTransactionObject.setIssuerId(issuer.issuerId);
    dwollaPostTransactionObject.setDwollaPreTransactionId(
      dwollaPreTransaction.dwollaPreTransactionId,
    );

    await this.dwollaPostTransactionsRepository.add(dwollaPostTransactionObject);
  }

  async addRepayments(
    dwollaPreTransaction,
    transferId,
    campaign,
    user,
    entityId,
    uploadId,
  ) {
    const accountName =
      dwollaPreTransaction.destination === 'wallet' ||
      dwollaPreTransaction.destination === 'Wallet'
        ? 'Wallet'
        : 'Bank';
    const repaymentObject = Repayments.createFromDetail(
      dwollaPreTransaction.interestPaid,
      dwollaPreTransaction.principalPaid,
      'Paid',
      dwollaPreTransaction.destination === 'bank' ||
        dwollaPreTransaction.destination === 'Bank'
        ? 'ACH'
        : 'Wallet',
      dwollaPreTransaction.total,
      accountName,
      new Date(),
    );
    repaymentObject.setCampaignId(campaign.campaignId);
    repaymentObject.setInvestorId(user.investor.investorId);
    if (transferId !== '') {
      repaymentObject.setDwollaTransferId(transferId);
    }
    if (entityId !== '') {
      repaymentObject.setEntityId(entityId);
    }
    repaymentObject.setUploadId(uploadId);
    await this.repaymentRepository.add(repaymentObject);
  }

  async updateDwollaPostTransactions(dwollaPostTransactionId, transferId) {
    const dwollaPostTransaction = await this.dwollaPostTransactionsRepository.fetchById(
      dwollaPostTransactionId,
    );
    if (dwollaPostTransaction) {
      const input = {
        ...dwollaPostTransaction,
        dwollaTransferId: transferId,
      };

      return this.dwollaPostTransactionsRepository.update(input, {
        dwollaPostTransactionId,
      });
    } else {
      return false;
    }
  }

  async updateRepayments(uploadId, transferId) {
    const repayment = await this.repaymentRepository.fetchOneByCustomCritera({
      whereConditions: { uploadId },
    });

    if (repayment) {
      const repaymentObject = Repayments.createFromObject(repayment);
      repaymentObject.setDwollaTransferId(transferId);
      return this.repaymentRepository.update(repaymentObject, {
        uploadId,
      });
    } else {
      return false;
    }
  }

  async execute(createPostTransactionsUseCaseDTO: CreatePostTransactionsUseCaseDTO) {
    const uploadId = createPostTransactionsUseCaseDTO.getUploadId();
    const dwollaPreTransactions = await this.dwollaPreTransactionRepository.fetchAllByUploadId(
      uploadId,
    );

    await async.eachSeries(dwollaPreTransactions, async (dwollaPreTransaction: any) => {
      let dwollaPostTransactionId = uuid();
      let idempotencyId = uuid();
      let transferId = '';
      let entityId = '';

      const issuer = await this.issuerRepository.fetchOneByCustomCritera({
        whereConditions: { email: dwollaPreTransaction.issuerEmail },
      });

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
            intermediaryName: dwollaPreTransaction.entityName,
          },
        });
        if (entity) {
          entityId = entity.entityIntermediaryId;
        }
      }

      if (issuer && user) {
        if (
          dwollaPreTransaction.source.toLowerCase() === 'wallet' &&
          dwollaPreTransaction.destination.toLowerCase() === 'wallet'
        ) {
          transferId = await this.walletToWalletTransfer(
            dwollaPreTransaction,
            issuer,
            user,
            idempotencyId,
            campaign,
          );
        } else if (
          dwollaPreTransaction.source.toLowerCase() === 'wallet' &&
          dwollaPreTransaction.destination.toLowerCase() === 'bank'
        ) {
          transferId = await this.walletToBankTransfer(
            dwollaPreTransaction,
            issuer,
            user,
            idempotencyId,
            campaign,
          );
        } else if (
          dwollaPreTransaction.source.toLowerCase() === 'bank' &&
          dwollaPreTransaction.destination.toLowerCase() === 'wallet'
        ) {
          transferId = await this.bankToWalletTransfer(
            dwollaPreTransaction,
            issuer,
            user,
            idempotencyId,
            campaign,
          );
        } else if (
          dwollaPreTransaction.source.toLowerCase() === 'bank' &&
          dwollaPreTransaction.destination.toLowerCase() === 'bank'
        ) {
          transferId = await this.bankToBankTransfer(
            dwollaPreTransaction,
            issuer,
            user,
            idempotencyId,
            campaign,
          );
        } else {
          transferId = '';
        }

        if (transferId != '') {
          dwollaPreTransaction.status = 'Processed';
          await this.dwollaPreTransactionRepository.update(dwollaPreTransaction, {
            uploadId,
          });
        }
        await this.addDwollaPostTransactions(
          dwollaPostTransactionId,
          dwollaPreTransaction,
          idempotencyId,
          transferId,
          issuer,
        );

        await this.addRepayments(
          dwollaPreTransaction,
          transferId,
          campaign,
          user,
          entityId,
          uploadId,
        );
        await this.updateDwollaPostTransactions(dwollaPostTransactionId, transferId);
        await this.updateRepayments(uploadId, transferId);
      }
    });
    const repaymentsUpdate = RepaymentsUpdate.createFromDetail();
    await this.repaymentUpdateRepository.add(repaymentsUpdate);
    return true;
  }
}

export default CreatePostTransactionsUseCase;
