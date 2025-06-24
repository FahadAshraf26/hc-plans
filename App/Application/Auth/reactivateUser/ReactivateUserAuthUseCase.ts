import {
  ISendEmailVerificationLinkUseCase,
  ISendEmailVerificationLinkUseCaseId,
} from '@application/User/sendEmailVerificationLink/ISendEmailVerificationLinkUseCase';
import { IUserRepository, IUserRepositoryId } from '@domain/Core/User/IUserRepository';
import { IUserEventDao, IUserEventDaoId } from '@domain/Core/UserEvent/IUserEventDao';
import UserEvent from '@domain/Core/UserEvent/UserEvent';
import { TokenType } from '@domain/Core/ValueObjects/TokenType';
import { UserEventTypes } from '@domain/Core/ValueObjects/UserEventTypes';
import HttpException from '@infrastructure/Errors/HttpException';
import { IAuthService, IAuthServiceId } from '@infrastructure/Service/Auth/IAuthService';
import { inject, injectable } from 'inversify';
import { IReactivateUserAuthUseCase } from './IReactivateUserAuthUseCase';
import ReactivateUserDTO from './ReactivateUserDTO';

@injectable()
class ReactivateUserAuthUseCase implements IReactivateUserAuthUseCase {
  constructor(
    @inject(IUserRepositoryId) private userRepository: IUserRepository,
    @inject(IUserEventDaoId) private userEventDao: IUserEventDao,
    @inject(ISendEmailVerificationLinkUseCaseId)
    private sendEmailVerificationLinkUseCase: ISendEmailVerificationLinkUseCase,
    @inject(IAuthServiceId) private authService: IAuthService,
  ) {}

  async execute(reactivateUserDTO: ReactivateUserDTO) {
    try {
      if (!reactivateUserDTO.getActivationToken()) {
        throw new HttpException(400, 'activation token is required');
      }

      const decoded = await this.authService.verifyToken(
        reactivateUserDTO.getActivationToken(),
      );

      if (!decoded.type || decoded.type !== TokenType.REACTIVATE_USER) {
        throw new HttpException(400, 'invalid token');
      }

      const user = await this.userRepository.fetchById(decoded.userId, true);

      if (!user) {
        throw new HttpException(400, 'no such user');
      }

      await Promise.all([
        this.userRepository.activateUser(user),
        this.userEventDao.add(
          UserEvent.createFromDetail(user.userId, UserEventTypes.USER_REACTIVATED),
        ),
        this.sendEmailVerificationLinkUseCase.execute({
          user,
        }),
      ]);

      return true;
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }

      if (err.message === 'jwt expired') {
        throw new HttpException(400, 'token expired');
      }

      throw err;
    }
  }
}

export default ReactivateUserAuthUseCase;
