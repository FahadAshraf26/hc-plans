import PaginationData from '@domain/Utils/PaginationData';
import { IBaseRepository } from '@domain/Core/BaseEntity/IBaseRepository';
import UserAppFeedback from './UserAppFeedback';

export const IUserAppFeedbackDAOId = Symbol.for('IUserAppFeedbackDAO');

export interface IUserAppFeedbackDAO extends IBaseRepository {
  fetchAll({ paginationOptions, options }): Promise<PaginationData<UserAppFeedback>>;
  fetchByUserId(
    userId,
    paginationOptions,
    options,
  ): Promise<PaginationData<UserAppFeedback>>;
}
