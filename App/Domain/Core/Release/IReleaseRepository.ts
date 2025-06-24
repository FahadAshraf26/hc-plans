import { IBaseRepository } from '@domain/Core/BaseEntity/IBaseRepository';
import PaginationData from '@domain/Utils/PaginationData';
import PaginationOptions from '@domain/Utils/PaginationOptions';
import Release from '@domain/Core/Release/Release';

export const IReleaseRepositoryId = Symbol.for('IReleaseRepository');

type CustomCriteriaOptions = {
  paginationOptions?: PaginationOptions;
  showTrashed?: boolean;
};
export interface IReleaseRepository extends IBaseRepository {
  fetchAll({
    paginationOptions,
    showTrashed,
  }: CustomCriteriaOptions): Promise<PaginationData<Release>>;
}
