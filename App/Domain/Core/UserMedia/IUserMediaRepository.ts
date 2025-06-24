import PaginationData from '@domain/Utils/PaginationData';
import { IBaseRepository } from '@domain/Core/BaseEntity/IBaseRepository';
import PaginationOptions from '@domain/Utils/PaginationOptions';
import UserMedia from '@domain/Core/UserMedia/UserMedia';

export const IUserMediaRepositoryId = Symbol.for('IUserMediaRepository');

type CustomCriteriaOptions = {
  paginationOptions?: PaginationOptions;
  showTrashed?: boolean;
  query?: any;
};
export interface IUserMediaRepository extends IBaseRepository {
  fetchAll({
    paginationOptions,
    showTrashed,
    query,
  }: CustomCriteriaOptions): Promise<PaginationData<UserMedia>>;
  fetchByDwollaDocumentId(dwollaDocumentId: string): Promise<any>;
}
