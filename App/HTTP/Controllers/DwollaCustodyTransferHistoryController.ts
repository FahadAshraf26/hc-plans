import FetchDwollaCustodyTransferHistoryDTO from '@application/DwollaCustodyTransferHistory/FetchDwollaCustodyTransferHistoryDTO';
import {
  IDwollaCustodyTransferHistoryService,
  IDwollaCustodyTransferHistoryServiceId,
} from '@application/DwollaCustodyTransferHistory/IDwollaCustodyTransferHistoryService';

import { inject, injectable } from 'inversify';

@injectable()
class DwollaCustodyTransferHistoryController {
  constructor(
    @inject(IDwollaCustodyTransferHistoryServiceId)
    private dwollaCustodyTransferHistoryService: IDwollaCustodyTransferHistoryService,
  ) {}

  getCustodyTransferHistory = async (httpRequest) => {
    const { page, perPage, showTrashed, query } = httpRequest.query;
    const input = new FetchDwollaCustodyTransferHistoryDTO(page, perPage, showTrashed, query);
    const response = await this.dwollaCustodyTransferHistoryService.fetchCustodyTransferHistory(
      input,
    );
    return {
      body: response,
    };
  };
}

export default DwollaCustodyTransferHistoryController;
