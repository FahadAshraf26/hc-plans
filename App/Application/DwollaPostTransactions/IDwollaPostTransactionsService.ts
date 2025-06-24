import DwollaPostTransactions from '@domain/Core/DwollaPostTransactions/DwollaPostTransactions';
import FetchAllPostTransfersDTO from './FetchAllPostTransfersDTO';
import FetchByTransferIdDTO from './FetchByTransferIdDTO';

export const IDwollaPostTransactionsServiceId = Symbol.for(
  'IDwollaPostTransactionsService',
);
export interface IDwollaPostTransactionsService {
  fetchAllPostTransafers(
    fetchAllPostTransfersDTO: FetchAllPostTransfersDTO,
  ): Promise<any>;

  fetchByDwollaTransferId(
    fetchByTransferIdDTO: FetchByTransferIdDTO,
  ): Promise<DwollaPostTransactions>;
}
