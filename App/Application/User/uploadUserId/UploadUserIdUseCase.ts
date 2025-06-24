import HttpException from '@infrastructure/Errors/HttpException';
import { inject, injectable } from 'inversify';
import {
  IUserDocumentRepository,
  IUserDocumentRepositoryId,
} from '@domain/Core/UserDocument/IUserDocumentRepository';
import { IUserRepository, IUserRepositoryId } from '@domain/Core/User/IUserRepository';
import { IUploadUserIdUseCase } from '@application/User/uploadUserId/IUploadUserIdUseCase';
import mailService from '@infrastructure/Service/MailService';
import EmailTemplates from '../../../Domain/Utils/EmailTemplates';
import {
  IStorageService,
  IStorageServiceId,
} from '@infrastructure/Service/StorageService/IStorageService';
import config from '@infrastructure/Config';
import { KycStatus } from '@domain/Core/ValueObjects/KycStatus';
import { IUserEventDao, IUserEventDaoId } from '@domain/Core/UserEvent/IUserEventDao';
import UserEvent from '@domain/Core/UserEvent/UserEvent';
import { UserEventTypes } from '@domain/Core/ValueObjects/UserEventTypes';
import {
  ISlackService,
  ISlackServiceId,
} from '@infrastructure/Service/Slack/ISlackService';

const { SendHtmlEmail } = mailService;
const { emailConfig, server, slackConfig } = config;
const { userSubmittedIdentityTemplate, manualKYCReviewTemplate } = EmailTemplates;

@injectable()
class UploadUserIdUseCase implements IUploadUserIdUseCase {
  constructor(
    @inject(IUserDocumentRepositoryId)
    private userDocumentRepository: IUserDocumentRepository,
    @inject(IUserRepositoryId) private userRepository: IUserRepository,
    @inject(IStorageServiceId) private storageService: IStorageService,
    @inject(IUserEventDaoId) private userEventDao: IUserEventDao,
    @inject(ISlackServiceId) private slackService: ISlackService,
  ) {}

  async execute(dto) {
    const user = await this.userRepository.fetchById(dto[0].document.userId);
    const attachments = [];
    const link = `${server.ADMIN_PANEL_LINK}/users/${user.userId}/userInfo`;

    if (!user) {
      throw new HttpException(400, 'no user found');
    }

    for (let i = 0; i < dto.length; i++) {
      const document = dto[i].getUserDocument();

      const createResult = await this.userDocumentRepository.add(document);

      if (!createResult) {
        throw new HttpException(400, 'user document create failed');
      }

      const fileName = document.path;

      const stream = await this.storageService.getFileBuffer(fileName);
      attachments.push({
        filename: 'id.png',
        content: stream[0],
      });
    }

    const date = new Date(user.dob);
    const template = manualKYCReviewTemplate
      .replace('{@USER_ID}', user.userId)
      .replace('{@FIRST_NAME}', user.firstName)
      .replace('{@LAST_NAME}', user.lastName)
      .replace('{@EMAIL}', user.email)
      .replace('{@DOB}', date.toString())
      .replace('{@SSN}', user.ssn)
      .replace('{@CITY}', user.city)
      .replace('{@STATE}', user.state)
      .replace('{@ZIP_CODE}', user.zipCode);

    await SendHtmlEmail(
      emailConfig.HONEYCOMB_EMAIL,
      'KYC Failed. Please perform manual check',
      template,
      attachments,
    );

    await SendHtmlEmail(
      user.email,
      'Id Verification Submission',
      userSubmittedIdentityTemplate.replace('{@FIRST_NAME}', user.firstName),
    );

    this.slackService.publishMessage({
      message: `${user.email} has uploaded an ID for review.`,
      slackChannelId: slackConfig.UPLOAD_ID.ID,
      url: `${link}`,
      btnText: 'View record',
    });

    user.setKycStatus(KycStatus.MANUAL_REVIEW);
    await this.userRepository.update(user);

    await this.userEventDao.add(
      UserEvent.createFromDetail(user.userId, UserEventTypes.USER_UPLOAD_ID),
    );

    return true;
  }
}

export default UploadUserIdUseCase;
