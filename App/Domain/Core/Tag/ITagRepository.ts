import PaginationData from '../../Utils/PaginationData';
import Tag from './Tag';
import PaginationOptions from '@domain/Utils/PaginationOptions';
import { IBaseRepository } from '@domain/Core/BaseEntity/IBaseRepository';

export const ITagRepositoryId = Symbol.for('ITagRepository');

type fetchAllTagOptions = {
  paginationOptions: PaginationOptions;
  showTrashed: boolean;
  query: string;
};

export interface ITagRepository extends IBaseRepository {
  fetchAll({
    paginationOptions,
    showTrashed,
    query,
  }: fetchAllTagOptions): Promise<PaginationData<Tag>>;
  fetchAllPublicTags(): Promise<Array<Tag>>;
}
