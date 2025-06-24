import PaginationOptions from '@domain/Utils/PaginationOptions';
import PaginationData from '@domain/Utils/PaginationData';
import AdminUser from '@domain/Core/AdminUser/AdminUser';
import { IBaseRepository } from '@domain/Core/BaseEntity/IBaseRepository';

export const IAdminUserRepositoryId = Symbol.for('IAdminUserRepository');
type adminUserOption = {
  paginationOptions: PaginationOptions;
};

export interface IAdminUserRepository extends IBaseRepository {
  fetchAll(options: adminUserOption): Promise<PaginationData<AdminUser>>;
  fetchById(adminUserId: string): Promise<AdminUser>;
  fetchByEmail(email: string): Promise<AdminUser>;
}
