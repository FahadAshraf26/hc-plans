import {
  IDwollaPostTransactionsRepositoryId,
  IDwollaPostTransactionsRepository,
} from '@domain/Core/DwollaPostTransactions/IDwollaPostTransactionsRepository';
import { inject, injectable } from 'inversify';
import FetchAllPostTransfersDTO from './FetchAllPostTransfersDTO';
import FetchByTransferIdDTO from './FetchByTransferIdDTO';
import { IDwollaPostTransactionsService } from './IDwollaPostTransactionsService';

@injectable()
class DwollaPostTransactionsService implements IDwollaPostTransactionsService {
  constructor(
    @inject(IDwollaPostTransactionsRepositoryId)
    private dwollaPostTransactionsRepoistory: IDwollaPostTransactionsRepository,
  ) {}

  async fetchAllPostTransafers(fetchAllPostTransfersDTO: FetchAllPostTransfersDTO) {
    const response = await this.dwollaPostTransactionsRepoistory.fetchPostTransafers(
      fetchAllPostTransfersDTO.getPaginationOptions(),
      fetchAllPostTransfersDTO.isShowTrashed(),
    );

    return response.getPaginatedData();
  }

  async fetchByDwollaTransferId(fetchByTransferIdDTO: FetchByTransferIdDTO) {
    return this.dwollaPostTransactionsRepoistory.fetchByTransferId(
      fetchByTransferIdDTO.getDwollaTransferId(),
    );
  }
}
export default DwollaPostTransactionsService;
