import { IDwollaPreTransactionsService } from './IDwollaPreTransactionsService';
import {
  IDwollaPreTransactionsRepositoryId,
  IDwollaPreTransactionsRepository,
} from '@domain/Core/DwollaPreTransactions/IDwollaPreTransactionsRepository';
import { inject, injectable } from 'inversify';
import UpdatePreTransactionDTO from './UpdatePreTransactionDTO';
import FetchPreTransactionsByIdDTO from './FetchPreTransactionsByIdDTO';

@injectable()
class DwollaPreTransactionsService implements IDwollaPreTransactionsService {
  constructor(
    @inject(IDwollaPreTransactionsRepositoryId)
    private dwollaPreTransactionRepository: IDwollaPreTransactionsRepository,
  ) {}

  async fetchLatestPreTransactions() {
    const result = await this.dwollaPreTransactionRepository.fetchAllLatestPreTransactions();

    return {
      status: 'success',
      data: result.dwollaPreTransactions,
      totalAmount: result.totalAmount,
      totalCount: result.totalCount,
    };
  }

  async updatePreTransactions(updatePreTransactionsDTO: UpdatePreTransactionDTO) {
    const dwollaPreTransactionId = updatePreTransactionsDTO.getDwollaPreTransactionId();
    const dwollaPreTransaction = updatePreTransactionsDTO.getPayload();
    dwollaPreTransaction.total =
      parseFloat(dwollaPreTransaction.interestPaid) +
      parseFloat(dwollaPreTransaction.principalPaid);
    return this.dwollaPreTransactionRepository.update(dwollaPreTransaction, {
      dwollaPreTransactionId,
    });
  }

  async getPreTransactionsById(fetchPreTransactionByIdDTO: FetchPreTransactionsByIdDTO) {
    const dwollaPreTransactionId = fetchPreTransactionByIdDTO.getDwollaPreTransactionId();
    return this.dwollaPreTransactionRepository.fetchById(dwollaPreTransactionId);
  }

  async removeByUploadId(uploadId: string) {
    return this.dwollaPreTransactionRepository.removeAllByUploadId(uploadId);
  }
}

export default DwollaPreTransactionsService;
