import models from '../Model';
import UserAppFeedback from '../../Domain/Core/UserAppFeedBack/UserAppFeedback';
import BaseRepository from './BaseRepository';
import { IUserAppFeedbackDAO } from '@domain/Core/UserAppFeedBack/IUserAppFeedbackDAO';
import { injectable } from 'inversify';
const { UserAppFeedbackModel, Sequelize } = models;
const { Op } = Sequelize;

@injectable()
class UserAppFeedbackDAO extends BaseRepository implements IUserAppFeedbackDAO {
  constructor() {
    super(UserAppFeedbackModel, 'userAppFeedbackId', UserAppFeedback);
  }
  /**
   * Fetch all userAppFeedbacks from database with pagination
   * @returns UserAppFeedback[]
   * @param paginationOptions
   * @param options
   */
  async fetchAll({ paginationOptions, options }) {
    const { showTrashed = false, query } = options;

    return super.fetchAll({
      paginationOptions,
      showTrashed,
      whereConditions: query ? { userAppFeedback: { [Op.like]: `%${query}%` } } : {},
    });
  }

  async fetchByUserId(userId, paginationOptions, options) {
    const { showTrashed = false } = options;
    return super.fetchAll({
      paginationOptions,
      showTrashed,
      whereConditions: { userId },
    });
  }
}

export default UserAppFeedbackDAO;
