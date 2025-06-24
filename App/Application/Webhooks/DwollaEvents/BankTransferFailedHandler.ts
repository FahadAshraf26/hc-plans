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

  constructor(
    event: any,
    dwollaToBankTransactionsRepository: IDwollaToBankTransactionsRepository,
    dwollaService: IDwollaService,
    repaymentsRepository: IRepaymentsRepository,
    dwollaPostTransactionsRepository: IDwollaPostTransactionsRepository,
    dwollaPostBankTransactionsRepository: IDwollaPostBankTransactionsRepository,
  ) {
    this.event = event;
    this.dwollaToBankTransactionsRepository = dwollaToBankTransactionsRepository;
    this.dwollaService = dwollaService;
    this.repaymentsRepository = repaymentsRepository;
    this.dwollaPostTransactionsRepository = dwollaPostTransactionsRepository;
    this.dwollaPostBankTransactionsRepository = dwollaPostBankTransactionsRepository;
  }

  async updateDwollaToBankTransactions(transferId, status) {
    const dwollaToBankTransactions = await this.dwollaToBankTransactionsRepository.getByTransactionId(
      transferId,
    );
    if (dwollaToBankTransactions !== null) {
      const input = {
        ...dwollaToBankTransactions,
        transferStatus: status,
      };
      return this.dwollaToBankTransactionsRepository.updateTransfer(input);
    } else {
      return false;
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
      return true;
    } catch (error) {
      logger.error(error);
      return false;
    }
  }
}

export default BankTransferCompletedHandler;
