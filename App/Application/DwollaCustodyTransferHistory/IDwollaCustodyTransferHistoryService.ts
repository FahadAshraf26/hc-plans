import FetchCustodyTransferHistoryDTO from './FetchDwollaCustodyTransferHistoryDTO';

export const IDwollaCustodyTransferHistoryServiceId = Symbol.for(
  'IDwollaCustodyTransferHistoryService',
);
export interface IDwollaCustodyTransferHistoryService {
  fetchCustodyTransferHistory(
    fetchCustodyTransferHistoryDTO: FetchCustodyTransferHistoryDTO,
  ): Promise<any>;
}
