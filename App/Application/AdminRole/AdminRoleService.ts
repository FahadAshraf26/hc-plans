import HttpException from '../../Infrastructure/Errors/HttpException';
import CreateAdminDTO from './CreateAdminRoleDTO';
import FindAdminRoleDTO from './FindAdminRoleDTO';
import GetAdminRoleDTO from './GetAdminRoleDTO';
import UpdateAdminRoleDTO from './UpdateAdminRoleDTO';
import RemoveAdminRoleDTO from './RemoveAdminRoleDTO';
import { inject, injectable } from 'inversify';
import {
  IAdminRoleRepository,
  IAdminRoleRepositoryId,
} from '../../Domain/Core/AdminRole/IAdminRoleRepository';

@injectable()
class AdminRoleService {
  constructor(
    @inject(IAdminRoleRepositoryId) private adminRoleRepository: IAdminRoleRepository,
  ) {}
  /**
   *
   * @param createAdminRoleDTO
   */
  async createAdminRole(createAdminRoleDTO: CreateAdminDTO) {
    const createResult = await this.adminRoleRepository.add(
      createAdminRoleDTO.getAdminRole(),
    );

    if (!createResult) {
      throw new HttpException(400, 'create admin user failed');
    }

    return createResult;
  }

  /**
   *
   * @param {FindAdminRoleDTO} findAdminRoleDTO
   */
  async findAdminRole(findAdminRoleDTO: FindAdminRoleDTO) {
    const adminRole = await this.adminRoleRepository.fetchById(
      findAdminRoleDTO.getAdminRoleId(),
    );

    if (!adminRole) {
      throw new HttpException(404, 'no admin user found');
    }

    return adminRole;
  }

  /**
   *
   * @param {UpdateAdminRoleDTO} updateAdminRoleDTO
   */
  async updateAdminRole(updateAdminRoleDTO: UpdateAdminRoleDTO) {
    const adminRole = await this.adminRoleRepository.fetchById(
      updateAdminRoleDTO.getAdminRoleId(),
    );

    if (!adminRole) {
      throw new HttpException(404, 'no admin user found');
    }

    const updateResult = await this.adminRoleRepository.update(
      updateAdminRoleDTO.getAdminRole(),
    );

    if (!updateResult) {
      throw new HttpException(400, 'update admin failed');
    }

    return updateResult;
  }

  /**
   *
   * @param {removeAdminRoleDTO} removeAdminRoleDTO
   */
  async removeAdminRole(removeAdminRoleDTO: RemoveAdminRoleDTO) {
    const adminRole = await this.adminRoleRepository.fetchById(
      removeAdminRoleDTO.getAdminRoleId(),
    );

    if (!adminRole) {
      throw new HttpException(404, 'no admin user found');
    }

    const deleteResult = await this.adminRoleRepository.remove(adminRole);

    if (!deleteResult) {
      throw new HttpException(400, 'update admin failed');
    }

    return deleteResult;
  }

  /**
   *
   * @param {getAdminRoleDTO} getAdminRoleDTO
   */
  async getAdminRole(getAdminRoleDTO: GetAdminRoleDTO) {
    const result = await this.adminRoleRepository.fetchAll({
      paginationOptions: getAdminRoleDTO.getPaginationOptions(),
    });

    return result.getPaginatedData();
  }
}

export default AdminRoleService;
