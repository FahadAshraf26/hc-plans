import {
  IDwollaPostBankTransactionsRepositoryId,
  IDwollaPostBankTransactionsRepository,
} from '@domain/Core/DwollaPostBankTransactions/IDwollaPostBankTransactionsRepository';
import { inject, injectable } from 'inversify';
import FetchAllPostBankTransfersDTO from './FetchAllPostBankTransfersDTO';
import FetchByTransferIdDTO from './FetchByTransferIdDTO';
import { IDwollaPostBankTransactionsService } from './IDwollaPostBankTransactionsService';

@injectable()
class DwollaPostBankTransactionsService implements IDwollaPostBankTransactionsService {
  constructor(
    @inject(IDwollaPostBankTransactionsRepositoryId)
    private dwollaPostBankTransactionsRepoistory: IDwollaPostBankTransactionsRepository,
  ) {}

  async fetchAllPostBankTransafers(
    fetchAllPostTransfersDTO: FetchAllPostBankTransfersDTO,
  ) {
    const response = await this.dwollaPostBankTransactionsRepoistory.fetchPostBankTransafers(
      fetchAllPostTransfersDTO.getPaginationOptions(),
      fetchAllPostTransfersDTO.isShowTrashed(),
    );

    return response.getPaginatedData();
  }

  async fetchByDwollaTransferId(fetchByTransferIdDTO: FetchByTransferIdDTO) {
    return this.dwollaPostBankTransactionsRepoistory.fetchByTransferId(
      fetchByTransferIdDTO.getDwollaTransferId(),
    );
  }
}
export default DwollaPostBankTransactionsService;
