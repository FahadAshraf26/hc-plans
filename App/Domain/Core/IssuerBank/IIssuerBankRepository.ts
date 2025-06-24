import PaginationOptions from '@domain/Utils/PaginationOptions';
import PaginationData from '@domain/Utils/PaginationData';
import UserMedia from '@domain/Core/UserMedia/UserMedia';
import IssuerBank from '@domain/Core/IssuerBank/IssuerBank';
import { IBaseRepository } from '@domain/Core/BaseEntity/IBaseRepository';

export const IIssuerBankRepositoryId = Symbol.for('IIssuerBankRepository');

type CustomCriteriaOptions = {
  paginationOptions?: PaginationOptions;
  showTrashed?: boolean;
  issuerId?: string;
  includeWallet?: boolean;
};
export interface IIssuerBankRepository extends IBaseRepository {
  fetchByIssuerId({
    issuerId,
    paginationOptions,
    showTrashed,
    includeWallet,
  }: CustomCriteriaOptions): Promise<any>;
  fetchIssuerBank(issuerId);
  fetchIssuerWallet(issuerId);
  updateIssuerBank(issuerBabk);
  updateIssuerBankByIssuerId(issuerBank);
  updateIssuerBankById(issuerBank);
  fetchByDwollaSourceId(dwollaSourceId);
  fetchLatestDeletedBankByIssuerIdExcludingWallet({
    issuerId,
    paginationOptions,
    showTrashed,
  }: CustomCriteriaOptions): Promise<PaginationData<IssuerBank>>;
  fetchAllBanksByIssuerId(issuerId: string): Promise<IssuerBank[]>;
}
