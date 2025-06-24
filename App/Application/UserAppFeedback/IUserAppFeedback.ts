import CreateUserAppFeedbackDTO from '@application/UserAppFeedback/CreateUserAppFeedbackDTO';
import GetUserAppFeedbackDTO from '@application/UserAppFeedback/GetUserAppFeedbackDTO';
import { PaginationDataResponse } from '@domain/Utils/PaginationData';
import UserAppFeedback from '@domain/Core/UserAppFeedBack/UserAppFeedback';
import FindUserAppFeedbackDTO from '@application/UserAppFeedback/FindUserAppFeedbackDTO';

export const IUserAppFeedbackService = Symbol.for('IUserAppFeedback');

export interface IUserAppFeedback {
  createUserAppFeedback(
    createUserAppFeedbackDTO: CreateUserAppFeedbackDTO,
  ): Promise<boolean>;
  getUserAppFeedback(
    getUserAppFeedbackDTO: GetUserAppFeedbackDTO,
  ): Promise<PaginationDataResponse<UserAppFeedback>>;
  findUserAppFeedback(
    findUserAppFeedbackDTO: FindUserAppFeedbackDTO,
  ): Promise<UserAppFeedback>;
}
