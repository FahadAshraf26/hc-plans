import UserEvent from '../../../Domain/Core/UserEvent/UserEvent';
import { UserEventTypes } from '../../../Domain/Core/ValueObjects/UserEventTypes';
import HttpError from '../../../Infrastructure/Errors/HttpException';
import { IUserRepository, IUserRepositoryId } from '@domain/Core/User/IUserRepository';
import { IUserEventDao, IUserEventDaoId } from '@domain/Core/UserEvent/IUserEventDao';
import { injectable, inject } from 'inversify';
import { IReactivateUserUseCase } from './IReactivateUserUseCase';

@injectable()
class ReactivateUserUseCase implements IReactivateUserUseCase {
  constructor(
    @inject(IUserRepositoryId) private userRepository: IUserRepository,
    @inject(IUserEventDaoId) private userEventDAO: IUserEventDao,
  ) {}

  async execute({ userId }: { userId: string }) {
    const user = await this.userRepository.fetchById(userId, true);

    if (!user) {
      throw new HttpError(400, 'no resource found');
    }

    await this.userRepository.activateUser(user);
    await this.userEventDAO.add(
      UserEvent.createFromDetail(userId, UserEventTypes.USER_REACTIVATED),
    );

    return true;
  }
}

export default ReactivateUserUseCase;
