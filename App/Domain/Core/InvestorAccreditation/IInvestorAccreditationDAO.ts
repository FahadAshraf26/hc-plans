import PaginationData from '@domain/Utils/PaginationData';
import { IBaseRepository } from '@domain/Core/BaseEntity/IBaseRepository';
import InvestorAccreditation from './InvestorAccreditation';

export const IInvestorAccreditationDAOId = Symbol.for('IInvestorAccreditationDAO');

export interface IInvestorAccreditationDAO extends IBaseRepository {
  fetchByInvestorId(
    investorId: string,
    wherePendingResult?: boolean,
    showTrashed?: boolean,
  ): Promise<InvestorAccreditation>;
  upsert(investorAccreditation: InvestorAccreditation): Promise<boolean>;
  fetchAllByInvestorId(
    investorId: string,
    paginationOptions,
    options,
  ): Promise<PaginationData<any>>;
  update(investorAccreditation: InvestorAccreditation): Promise<boolean>;
}
