import Investor from '@domain/Core/Investor/Investor';
import { IBaseRepository } from '@domain/Core/BaseEntity/IBaseRepository';

export const IInvestorDaoId = Symbol.for('IInvestorDao');

export interface IInvestorDao extends IBaseRepository {
  fetchByUserId(userId: string, showTrashed?: boolean): Promise<Investor>;
  fetchByHash(hash: string, showTrashed?: boolean): Promise<Investor>;
  fetchByDwollaId(dwollaCustomerId: string, showTrashed?: boolean): Promise<Investor>;
  fetchByNCAccountId(ncAccountId: string, showTrashed?: boolean): Promise<Investor>;
  fetchByDwollaCustomerId(dwollaCustomerId: string): Promise<any>;
}
