import PaginationData from '../../../Domain/Utils/PaginationData';
import AdminRole from '../../../Domain/Core/AdminRole/AdminRole';
import PaginationOptions from '../../../Domain/Utils/PaginationOptions';
import { IBaseRepository } from '@domain/Core/BaseEntity/IBaseRepository';

export const IAdminRoleRepositoryId = Symbol.for('IAdminRoleRepository');

type adminRoleOptions = {
  paginationOptions: PaginationOptions;
};
export interface IAdminRoleRepository extends IBaseRepository {
  fetchAll({ paginationOptions }: adminRoleOptions): Promise<PaginationData<AdminRole>>;
}
