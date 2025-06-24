import {
  IDwollaPreBankTransactionsRepositoryId,
  IDwollaPreBankTransactionsRepository,
} from '@domain/Core/DwollaPreBankTransactions/IDwollaPreBankTransactionsRepository';
import { IDwollaPreBankTransactionsService } from './IDwollaPreBankTransactionService';
import { inject, injectable } from 'inversify';
import UpdateDwollaPreBankTransactionsDTO from './UpdateDwollaPreBankTransactionsDTO';
import FetchDwollaPreBankPreTransactionsByIdDTO from './FetchDwollaPreBankTransactionsByIdDTO';

@injectable()
class DwollaPreBankTransactionsService implements IDwollaPreBankTransactionsService {
  constructor(
    @inject(IDwollaPreBankTransactionsRepositoryId)
    private dwollaPreBankTransactionsRepository: IDwollaPreBankTransactionsRepository,
  ) {}

  async fetchLatestPreBankTransactionsForWallet() {
    const result = await this.dwollaPreBankTransactionsRepository.fetchAllLatestPreBankTransactionsForWallet();
    return {
      status: 'success',
      data: result.dwollaPreBankTransactions,
    };
  }

  async fetchLatestPreBankTransactionsForCustody() {
    const result = await this.dwollaPreBankTransactionsRepository.fetchAllLatestPreBankTransactionsForCustody();
    return {
      status: 'success',
      data: result.dwollaPreBankTransactions,
    };
  }

  async updatePreBankTransactions(
    updatePreBankTransactionsDTO: UpdateDwollaPreBankTransactionsDTO,
  ) {
    const dwollaPreBankTransactionId = updatePreBankTransactionsDTO.getDwollaPreBankTransactionId();
    const dwollaPreBankTransaction = updatePreBankTransactionsDTO.getPayload();

    return this.dwollaPreBankTransactionsRepository.update(dwollaPreBankTransaction, {
      dwollaPreBankTransactionId,
    });
  }

  async getPreBankTransactionsById(
    fetchPreBankTransactionByIdDTO: FetchDwollaPreBankPreTransactionsByIdDTO,
  ) {
    const dwollaPreBankTransactionId = fetchPreBankTransactionByIdDTO.getDwollaPreBankTransactionId();
    return this.dwollaPreBankTransactionsRepository.fetchById(dwollaPreBankTransactionId);
  }

  async removeByUploadId(uploadId: string) {
    return this.dwollaPreBankTransactionsRepository.removeAllByUploadId(uploadId);
  }

  async removeByDwollaPreBankTransactionId(dwollaPreBankTransactionId: string) {
    return this.dwollaPreBankTransactionsRepository.removeAllByDwollaPreBankTransactionId(dwollaPreBankTransactionId);
  }

}

export default DwollaPreBankTransactionsService;
