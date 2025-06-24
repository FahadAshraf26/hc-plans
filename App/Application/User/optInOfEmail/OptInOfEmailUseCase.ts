import UserEvent from '../../../Domain/Core/UserEvent/UserEvent';
import { UserEventTypes } from '../../../Domain/Core/ValueObjects/UserEventTypes';
import HttpError from '../../../Infrastructure/Errors/HttpException';
import mailGunService from '../../../Infrastructure/Service/MailGun';
import { IUserRepository, IUserRepositoryId } from '@domain/Core/User/IUserRepository';
import { IUserEventDao, IUserEventDaoId } from '@domain/Core/UserEvent/IUserEventDao';
import { inject, injectable } from 'inversify';
import { IOptInOfEmailUseCase } from './IOptInOfEmailUseCase';

@injectable()
class OptInOfEmailUseCase implements IOptInOfEmailUseCase {
  constructor(
    @inject(IUserRepositoryId) private userRepository: IUserRepository,
    @inject(IUserEventDaoId) private userEventDAO: IUserEventDao,
  ) {}

  async execute(dto: { userId: string }) {
    const user = await this.userRepository.fetchById(dto.userId);

    if (!user) {
      throw new HttpError(400, 'no resource found');
    }

    user.subscribeToMailGun();
    await mailGunService.subscribe(user.email);
    await this.userRepository.update(user);
    await this.userEventDAO.add(
      UserEvent.createFromDetail(user.userId, UserEventTypes.USER_OPT_IN_OF_EMAIL),
    );

    return true;
  }
}

export default OptInOfEmailUseCase;
