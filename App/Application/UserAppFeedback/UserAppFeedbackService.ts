import HttpException from '../../Infrastructure/Errors/HttpException';
import { inject, injectable } from 'inversify';
import {
  IUserAppFeedbackDAO,
  IUserAppFeedbackDAOId,
} from '@domain/Core/UserAppFeedBack/IUserAppFeedbackDAO';
import { IUserRepository, IUserRepositoryId } from '@domain/Core/User/IUserRepository';
import mailService from '@infrastructure/Service/MailService';
import emailTemplates from '@domain/Utils/EmailTemplates';
import config from '@infrastructure/Config';
import { PaginationDataResponse } from '@domain/Utils/PaginationData';
import UserAppFeedback from '@domain/Core/UserAppFeedBack/UserAppFeedback';
import { IUserAppFeedback } from '@application/UserAppFeedback/IUserAppFeedback';
const { appFeedbackTemplate } = emailTemplates;
const { SendHtmlEmail } = mailService;
const { emailConfig } = config;

@injectable()
class UserAppFeedbackService implements IUserAppFeedback {
  constructor(
    @inject(IUserRepositoryId) private userRepository: IUserRepository,
    @inject(IUserAppFeedbackDAOId) private userAppFeedbackDAO: IUserAppFeedbackDAO,
  ) {}

  async createUserAppFeedback(createUserAppFeedbackDTO): Promise<boolean> {
    const appFeedback = createUserAppFeedbackDTO.getUserAppFeedback();
    const user = await this.userRepository.fetchById(appFeedback.userId, true);

    if (!user) {
      throw new HttpException(400, 'no user found against input');
    }

    const createResult = await this.userAppFeedbackDAO.add(appFeedback);

    if (!createResult) {
      throw new HttpException(400, 'creating user app feedback failed');
    }

    //send email to info@miventure.com
    const html = appFeedbackTemplate
      .replace('{@EMAIL}', user.email)
      .replace('{@NUM_STARS}', appFeedback.rating)
      .replace('{@FEEDBACK}', appFeedback.text);
    await SendHtmlEmail(emailConfig.HONEYCOMB_EMAIL, 'App Feedback Received', html);

    return createResult;
  }

  async getUserAppFeedback(
    getUserAppFeedbackDTO,
  ): Promise<PaginationDataResponse<UserAppFeedback>> {
    const result = await this.userAppFeedbackDAO.fetchByUserId(
      getUserAppFeedbackDTO.getUserId(),
      getUserAppFeedbackDTO.getPaginationOptions(),
      {
        showTrashed: getUserAppFeedbackDTO.isShowTrashed(),
      },
    );

    return result.getPaginatedData();
  }

  async findUserAppFeedback(findUserAppFeedbackDTO): Promise<UserAppFeedback> {
    const result = await this.userAppFeedbackDAO.fetchById(
      findUserAppFeedbackDTO.getUserAppFeedbackId(),
    );

    if (!result) {
      throw new HttpException(400, 'no app feedback record');
    }

    return result;
  }
}

export default UserAppFeedbackService;
