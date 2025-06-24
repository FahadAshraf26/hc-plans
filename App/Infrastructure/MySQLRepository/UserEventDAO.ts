import { IUserEventDao } from '@domain/Core/UserEvent/IUserEventDao';
import models from '../Model';
import UserEvent from '../../Domain/Core/UserEvent/UserEvent';
import filterUndefined from '../Utils/filterUndefined';
import BaseRepository from './BaseRepository';
const { UserEventModel } = models;

class UserEventDAO extends BaseRepository implements IUserEventDao {
  constructor() {
    super(UserEventModel, 'userEventId', UserEvent);
  }

  /**
   * Fetch all userEvents from database with pagination
   * @returns UserEvent[]
   * @param paginationOptions
   * @param showTrashed
   */
  async fetchAllUserEvents(paginationOptions, options) {
    const { showTrashed = false } = options;
    return super.fetchAll({
      paginationOptions,
      showTrashed,
    });
  }

  async fetchAllByUserId(
    userId,
    paginationOptions,
    options: { showTrashed?: any; type?: any } = {},
  ) {
    const { showTrashed = 'false', type } = options;

    const whereConditions = filterUndefined({
      userId,
      type,
    });

    return super.fetchAll({
      paginationOptions,
      showTrashed,
      whereConditions,
    });
  }

  async fetchLatestByType(eventType, options) {
    return super.fetchOneByCustomCritera({
      whereConditions: {
        type: eventType,
        ...options,
      },
      order: [['createdAt', 'desc']],
    });
  }
}

export default UserEventDAO;
