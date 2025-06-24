import PaginationData from '../../Utils/PaginationData';
import Tag from './TagCategory';
import PaginationOptions from '@domain/Utils/PaginationOptions';
import { IBaseRepository } from '@domain/Core/BaseEntity/IBaseRepository';

export const ITagCategoryRepositoryId = Symbol.for('ITagCategoryRepository');

type fetchAllTagOptions = {
  paginationOptions: PaginationOptions;
  showTrashed: boolean;
  query: string;
};

export interface ITagCategoryRepository extends IBaseRepository {
  fetchAll({
    paginationOptions,
    showTrashed,
    query,
  }: fetchAllTagOptions): Promise<PaginationData<Tag>>;
  fetchAllPublicTagCategories(): Promise<Array<Tag>>;
}
