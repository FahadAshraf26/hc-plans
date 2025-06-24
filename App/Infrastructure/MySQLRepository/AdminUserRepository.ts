import { IAdminUserRepository } from '../../Domain/Core/AdminUser/IAdminUserRepository';
import BaseRepository from './BaseRepository';
import PaginationData from '../../Domain/Utils/PaginationData';
import AdminUser from '../../Domain/Core/AdminUser/AdminUser';
import { injectable } from 'inversify';
import models from '../Model';
const { AdminUserModel, AdminRoleModel } = models;

const DatabaseError = require('../Errors/DatabaseError');

@injectable()
class AdminUserRepository extends BaseRepository implements IAdminUserRepository {
  constructor() {
    super(AdminUserModel, 'adminUserId', AdminUser);
  }

  includes = [
    {
      model: AdminRoleModel,
      as: 'role',
    },
  ];

  /**
   * Fetch all adminUsers from database with pagination
   * @returns AdminUser[]
   * @param options
   */
  async fetchAll(options): Promise<PaginationData<AdminUser>> {
    try {
      const { paginationOptions } = options;
      return super.fetchAll({ paginationOptions, includes: this.includes });
    } catch (e) {
      throw new DatabaseError(e);
    }
  }

  /**
   * fetchById(adminUserId) fetch adminUser By Id
   * @param {string} adminUserId
   * @returns AdminUser
   */
  async fetchById(adminUserId): Promise<AdminUser> {
    return super.fetchById(adminUserId, {
      includes: this.includes,
    });
  }

  async fetchByEmail(email): Promise<AdminUser> {
    const adminUserObj = await super.fetchOneByCustomCritera({
      whereConditions: { email },
      includes: this.includes,
      raw: true,
    });

    if (!adminUserObj) {
      return null;
    }

    const adminUser = AdminUser.createFromObject(adminUserObj);
    adminUser.setPassword(adminUserObj.password);

    return adminUser;
  }
}

export default AdminUserRepository;
