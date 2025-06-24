import CreateLoanwellDTO from './CreateLoanwellDTO';
import FetchLoanwellDTO from './FetchLoanwellDTO';
import ImportApiLoanwellDataDTO from './ImportApiLoanwellDataDTO';

export const ILoanwellSerivceId = Symbol.for('ILoanwellSerivce');
export interface ILoanwellSerivce {
  addLoanwellImport(createLoanwellDTO: CreateLoanwellDTO): Promise<void>;
  importApiLoanwellData(importApiLoanwellDataDTO: ImportApiLoanwellDataDTO): Promise<string[]>;
  fetchLoanwellBusinessNames(filterImported: string): Promise<object>;
  fetchLoanwellData(fetchloanwellDTO: FetchLoanwellDTO): Promise<object>;
}
