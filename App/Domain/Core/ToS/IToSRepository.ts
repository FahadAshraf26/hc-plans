import { IBaseRepository } from '@domain/Core/BaseEntity/IBaseRepository';
import PaginationOptions from '@domain/Utils/PaginationOptions';
import PaginationData from '@domain/Utils/PaginationData';
import ToS from '@domain/Core/ToS/ToS';

export const IToSRepositoryId = Symbol.for('IToSRepository');
type toSOptions = {
  paginationOptions: PaginationOptions;
  showTrashed?: boolean;
};
export interface IToSRepository extends IBaseRepository {
  fetchAll(options: toSOptions): Promise<PaginationData<ToS>>;
  fetchTos(): Promise<ToS>;
  fetchById(tosId: string): Promise<ToS>;
}
