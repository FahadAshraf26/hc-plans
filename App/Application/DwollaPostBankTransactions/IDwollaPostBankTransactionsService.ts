import DwollaPostTransactions from '@domain/Core/DwollaPostBankTransactions/DwollaPostBankTransactions';
import FetchAllPostBankTransfersDTO from './FetchAllPostBankTransfersDTO';
import FetchByTransferIdDTO from './FetchByTransferIdDTO';

export const IDwollaPostBankTransactionsServiceId = Symbol.for(
  'IDwollaPostBankTransactionsService',
);
export interface IDwollaPostBankTransactionsService {
  fetchAllPostBankTransafers(
    fetchAllPostTransfersDTO: FetchAllPostBankTransfersDTO,
  ): Promise<any>;

  fetchByDwollaTransferId(
    fetchByTransferIdDTO: FetchByTransferIdDTO,
  ): Promise<DwollaPostTransactions>;
}
