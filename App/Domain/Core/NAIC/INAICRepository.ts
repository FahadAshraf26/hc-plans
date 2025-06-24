import PaginationOptions from '@domain/Utils/PaginationOptions';
import PaginationData from '@domain/Utils/PaginationData';
import NAIC from '@domain/Core/NAIC/NAIC';
import { IBaseRepository } from '@domain/Core/BaseEntity/IBaseRepository';

type NAICOptions = {
  paginationOptions: PaginationOptions;
  query: string;
};

export const INAICRepositoryId = Symbol.for('INAICRepository');
export interface INAICRepository extends IBaseRepository {
  fetchAll({ paginationOptions, query }: NAICOptions): Promise<PaginationData<NAIC>>;
}
