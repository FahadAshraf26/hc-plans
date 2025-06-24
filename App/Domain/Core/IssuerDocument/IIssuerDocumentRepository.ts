import PaginationOptions from '@domain/Utils/PaginationOptions';
import PaginationData from '@domain/Utils/PaginationData';
import IssuerDocument from '@domain/Core/IssuerDocument/IssuerDocument';
import { IBaseRepository } from '@domain/Core/BaseEntity/IBaseRepository';

export const IIssuerDocumentRepositoryId = Symbol.for('IIssuerDocumentRepository');

type CustomCriteriaOptions = {
  paginationOptions?: PaginationOptions;
  showTrashed?: boolean;
};
type options = {
  showTrashed: boolean;
  query: any;
};
export interface IIssuerDocumentRepository extends IBaseRepository {
  fetchAll({
    paginationOptions,
    showTrashed,
  }: CustomCriteriaOptions): Promise<PaginationData<IssuerDocument>>;

  fetchByIssuer(
    issuerId: string,
    paginationOptions: PaginationOptions,
    options: options,
  ): Promise<PaginationData<IssuerDocument>>;
}
