import UserEvent from '../../../Domain/Core/UserEvent/UserEvent';
import { UserEventTypes } from '../../../Domain/Core/ValueObjects/UserEventTypes';
import HttpError from '../../../Infrastructure/Errors/HttpException';
import DeactivateUserDTO from './DeactivateUserDTO';
import { IUserRepository, IUserRepositoryId } from '@domain/Core/User/IUserRepository';
import { IUserEventDao, IUserEventDaoId } from '@domain/Core/UserEvent/IUserEventDao';
import { injectable, inject } from 'inversify';
import { IDeactivateUserUseCase } from './IDeactivateUserUseCase';

@injectable()
class DeactivateUserUseCase implements IDeactivateUserUseCase {
  constructor(
    @inject(IUserRepositoryId) private userRepository: IUserRepository,
    @inject(IUserEventDaoId) private userEventDAO: IUserEventDao,
  ) {}

  async execute(dto: DeactivateUserDTO) {
    const user = await this.userRepository.fetchById(dto.UserId());

    if (!user) {
      throw new HttpError(400, 'no resource found');
    }

    user.markAsDeleted();
    await this.userRepository.update(user);
    await this.userRepository.remove(user, dto.shouldHardDelete());
    await this.userEventDAO.add(
      UserEvent.createFromDetail(user.userId, UserEventTypes.USER_DEACTIVATED),
    );

    return true;
  }
}

export default DeactivateUserUseCase;
