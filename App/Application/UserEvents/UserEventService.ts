import HttpException from '../../Infrastructure/Errors/HttpException';
import { inject, injectable } from 'inversify';
import { IUserEventDao, IUserEventDaoId } from '@domain/Core/UserEvent/IUserEventDao';
import GetUserEventDTO from '@application/UserEvents/GetUserEventDTO';
import { IUserEventService } from '@application/UserEvents/IUserEventService';

@injectable()
class UserEventService implements IUserEventService {
  constructor(@inject(IUserEventDaoId) private userEventDAO: IUserEventDao) {}

  async get(dto: GetUserEventDTO) {
    const eventName = dto.getEventName();

    if (!!eventName === false) {
      throw new HttpException(400, 'event name is required');
    }

    const event = await this.userEventDAO.fetchLatestByType(eventName, {
      userId: dto.getUserId(),
    });

    if (!!event === false) {
      throw new HttpException(400, `No ${eventName} found for this user`);
    }

    return event;
  }
}

export default UserEventService;
