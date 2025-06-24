import { inject, injectable } from 'inversify';
import { IDwollaCustodyTransferHistoryService } from './IDwollaCustodyTransferHistoryService';
import FetchCustodyTransferHistoryDTO from './FetchDwollaCustodyTransferHistoryDTO';
import {
  IDwollaCustodyTransferHistoryRepository,
  IDwollaCustodyTransferHistoryRepositoryId,
} from '@domain/Core/DwollaCustodyTransferHistory/IDwollaCustodyTransferHistoryRepository';

@injectable()
class DwollaCustodyTransferHistoryService
  implements IDwollaCustodyTransferHistoryService {
  constructor(
    @inject(IDwollaCustodyTransferHistoryRepositoryId)
    private dwollaCustodyTransferHistoryRepository: IDwollaCustodyTransferHistoryRepository,
  ) {}

  async fetchCustodyTransferHistory(
    fetchCustodyTransferHistoryDTO: FetchCustodyTransferHistoryDTO,
  ) {
    const response = await this.dwollaCustodyTransferHistoryRepository.fetchAll({
      paginationOptions: fetchCustodyTransferHistoryDTO.getPaginationOptions(),
    });

    return response.getPaginatedData();
  }
}
export default DwollaCustodyTransferHistoryService;