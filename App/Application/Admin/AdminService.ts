import HttpException from '../../Infrastructure/Errors/HttpException';
import AuthInfrastructureService from '../../Infrastructure/Service/Auth/AuthService';
import CreateAdminDTO from './CreateAdminDTO';
import FindAdminDTO from './FindAdminDTO';
import GetAdminDTO from './GetAdminDTO';
import RemoveAdminDTO from './RemoveAdminDTO';
import UpdateAdminDTO from './UpdateAdminDTO';
import { inject, injectable } from 'inversify';
import {
  IAdminUserRepository,
  IAdminUserRepositoryId,
} from '@domain/Core/AdminUser/IAdminUserRepository';

@injectable()
class AdminService {
  constructor(
    private authInfrastructureService: AuthInfrastructureService,
    @inject(IAdminUserRepositoryId) private adminRepository: IAdminUserRepository,
  ) {}
  /**
   *
   * @param {CreateAdminDTO} createAdminDTO
   */
  async createAdmin(createAdminDTO: CreateAdminDTO) {
    const hashPass = await this.authInfrastructureService.hashPassword(
      createAdminDTO.getPassword(),
    );
    createAdminDTO.setPassword(hashPass);
    const createResult = await this.adminRepository.add(createAdminDTO.getAdminUser());

    if (!createResult) {
      throw new HttpException(400, 'create admin user failed');
    }
    const token = await this.authInfrastructureService.adminAuthToken(
      createAdminDTO.getAdminUserId(),
    );

    return { createResult, token };
  }

  /**
   *
   * @param {FindAdminDTO} findAdminDTO
   */
  async findAdmin(findAdminDTO: FindAdminDTO) {
    const adminUser = await this.adminRepository.fetchById(findAdminDTO.getAdminUserId());

    if (!adminUser) {
      throw new HttpException(404, 'no admin user found');
    }

    return adminUser;
  }

  /**
   *
   * @param {UpdateAdminDTO} updateAdminDTO
   */
  async updateAdmin(updateAdminDTO: UpdateAdminDTO) {
    const adminUser = await this.adminRepository.fetchById(
      updateAdminDTO.getAdminUserId(),
    );

    if (!adminUser) {
      throw new HttpException(404, 'no admin user found');
    }
    if (updateAdminDTO.getPassword()) {
      const hashPass = await this.authInfrastructureService.hashPassword(
        updateAdminDTO.getPassword(),
      );
      updateAdminDTO.setPassword(hashPass);
    }

    const updateResult = await this.adminRepository.update(updateAdminDTO.getAdminUser());

    if (!updateResult) {
      throw new HttpException(400, 'update admin failed');
    }

    return updateResult;
  }

  /**
   *
   * @param {removeAdminDTO} removeAdminDTO
   */
  async removeAdmin(removeAdminDTO: RemoveAdminDTO) {
    const adminUser = await this.adminRepository.fetchById(
      removeAdminDTO.getAdminUserId(),
    );

    if (!adminUser) {
      throw new HttpException(404, 'no admin user found');
    }

    const deleteResult = await this.adminRepository.remove(adminUser);

    if (!deleteResult) {
      throw new HttpException(400, 'update admin failed');
    }

    return deleteResult;
  }

  /**
   *
   * @param {getAdminDTO} getAdminDTO
   */
  async getAdmin(getAdminDTO: GetAdminDTO) {
    const result = await this.adminRepository.fetchAll({
      paginationOptions: getAdminDTO.getPaginationOptions(),
    });

    return result.getPaginatedData();
  }
}

export default AdminService;
