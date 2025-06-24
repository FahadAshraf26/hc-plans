import { IAdminRoleRepository } from '@domain/Core/AdminRole/IAdminRoleRepository';

import models from '../Model';
import AdminRole from '@domain/Core/AdminRole/AdminRole';
import BaseRepository from './BaseRepository';
import { injectable } from 'inversify';
const { AdminRoleModel } = models;

@injectable()
class AdminRoleRepository extends BaseRepository implements IAdminRoleRepository {
  constructor() {
    super(AdminRoleModel, 'adminRoleId', AdminRole);
  }
  /**
   * Fetch all adminRoles from database with pagination
   * @returns AdminRole[]
   * @param paginationOptions
   * @param showTrashed
   */
  async fetchAll({ paginationOptions }) {
    try {
      return await super.fetchAll({ paginationOptions });
    } catch (e) {
      throw Error(e);
    }
  }
}

export default AdminRoleRepository;
