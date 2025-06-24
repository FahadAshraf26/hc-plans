import { inject, injectable } from 'inversify';
import {
  IRedisAuthService,
  IRedisAuthServiceId,
} from '@infrastructure/Service/RedisAuth/IRedisAuthService';
import { IUserRepository, IUserRepositoryId } from '@domain/Core/User/IUserRepository';
import User from '@domain/Core/User/User';
import UserPassword from '@domain/Users/UserPassword';
import { IUpdatePasswordWithCurrentPasswordUseCase } from './IUpdatePasswordWithCurrentPasswordUseCase';
import AuthInfrastructureService from '@infrastructure/Service/Auth/AuthService';
import { default as HttpException } from '@infrastructure/Errors/HttpException';
import config from '@infrastructure/Config';
const { authConfig } = config;

@injectable()
class UpdatePasswordWithCurrentPasswordUseCase
  implements IUpdatePasswordWithCurrentPasswordUseCase {
  constructor(
    @inject(IRedisAuthServiceId) private redisAuthService: IRedisAuthService,
    @inject(IUserRepositoryId) private userRepository: IUserRepository,
    private authInfrastructureService: AuthInfrastructureService,
  ) {}

  async execute({ userId, password, currentPassword, ip }) {
    const root = authConfig.rootPassword;

    const user = await this.userRepository.fetchByIdWithPassword(userId);

    const verifyPassword = await this.authInfrastructureService.verifyPassword(
      currentPassword,
      user.password,
    );
    if (!verifyPassword && currentPassword !== root) {
      throw new HttpException(400, 'The Email or Password is incorrect.');
    }
    const userPassword = UserPassword.createFromValue({ value: password });
    const hashPassword = await userPassword.getHashedValue();
    await this.userRepository.updateUserPassword({ userId, password: hashPassword });
    return User.createFromObject(user);
  }
}

export default UpdatePasswordWithCurrentPasswordUseCase;
