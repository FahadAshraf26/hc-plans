import {
  ISlackService,
  ISlackServiceId,
} from './../../../Infrastructure/Service/Slack/ISlackService';
import AdminLoginDTO from './AdminLoginDTO';
import HttpException from '../../../Infrastructure/Errors/HttpException';
import AuthInfrastructureService from '../../../Infrastructure/Service/Auth/AuthService';
import { inject, injectable } from 'inversify';
import {
  IAdminUserRepository,
  IAdminUserRepositoryId,
} from '../../../Domain/Core/AdminUser/IAdminUserRepository';
import config from '@infrastructure/Config';

const { slackConfig } = config;
@injectable()
class AdminLoginUseCase {
  constructor(
    private authInfrastructureService: AuthInfrastructureService,
    @inject(IAdminUserRepositoryId) private adminUserRepository: IAdminUserRepository,
    @inject(ISlackServiceId) private slackService: ISlackService,
  ) {}
  /**
   *
   * @param {AdminLogInDTO} adminLoginDTO
   * @returns {Promise<Error|{user: User, token: *}>}
   */
  async execute(adminLoginDTO: AdminLoginDTO) {
    const adminUser = await this.adminUserRepository.fetchByEmail(
      adminLoginDTO.getEmail(),
    );
    if (!adminUser) {
      throw new HttpException(401, 'The Email or Password is incorrect.');
    }

    const verifyPassword = await this.authInfrastructureService.verifyPassword(
      adminLoginDTO.getPassword(),
      adminUser.password,
    );

    if (!verifyPassword) {
      throw new HttpException(401, 'The Email or Password is incorrect.');
    }

    const token = await this.authInfrastructureService.adminAuthToken(
      adminUser.adminUserId,
      '3h',
    );
    await this.slackService.publishMessage({
      message: `${adminLoginDTO.getEmail()} logged In to the admin panel`,
      slackChannelId: slackConfig.EMPLOYEE_ACTIVITY.ID,
    });

    return { adminUser, token };
  }
}

export default AdminLoginUseCase;
