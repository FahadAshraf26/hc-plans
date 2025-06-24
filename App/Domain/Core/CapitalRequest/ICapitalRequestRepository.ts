import PaginationOptions from '../../Utils/PaginationOptions';
import PaginationData from '../..//Utils/PaginationData';
import CapitalRequest from './CapitalRequest';
import { IBaseRepository } from '@domain/Core/BaseEntity/IBaseRepository';

export const ICapitalRequestRepositoryId = Symbol.for('ICapitalRequestRepository');

type capitalRequestOptions = {
  paginationOptions: PaginationOptions;
  showTrashed: boolean;
};
export interface ICapitalRequestRepository extends IBaseRepository {
  fetchAll(options: capitalRequestOptions): Promise<PaginationData<CapitalRequest>>;
}
