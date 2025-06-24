import HttpException from '@infrastructure/Errors/HttpException';
import { inject, injectable } from 'inversify';
import {
  IUserDocumentRepository,
  IUserDocumentRepositoryId,
} from '@domain/Core/UserDocument/IUserDocumentRepository';
import { IUserRepository, IUserRepositoryId } from '@domain/Core/User/IUserRepository';
import { IUploadVoidedCheckUseCase } from '@application/User/uploadVoidedCheck/IUploadVoidedCheckUseCase';
import mailService from '@infrastructure/Service/MailService';
import EmailTemplates from '@domain/Utils/EmailTemplates';
import config from '@infrastructure/Config';
import { ISlackService, ISlackServiceId } from '@infrastructure/Service/Slack/ISlackService';


const { SendHtmlEmail } = mailService;
const { emailConfig, server, slackConfig } = config;
const { uploadVoidedCheckTemplate } = EmailTemplates;

@injectable()
class UploadVoidedCheckUseCase implements IUploadVoidedCheckUseCase {
  constructor(
    @inject(IUserDocumentRepositoryId)
    private userDocumentRepository: IUserDocumentRepository,
    @inject(IUserRepositoryId) private userRepository: IUserRepository,
    @inject(ISlackServiceId)private slackService: ISlackService
  ) {}

  async execute(dto) {
    const user = await this.userRepository.fetchById(dto.getUserDocument().getUserId());
    

    if (!user) {
      throw new HttpException(400, 'no user found');
    }

    const document = dto.getUserDocument();

    const createResult = await this.userDocumentRepository.add(document);

    if (!createResult) {
      throw new HttpException(400, 'user document create failed');
    }
    
    const link = `${server.ADMIN_PANEL_LINK}/users/${user.userId}/userInfo`

    const template = uploadVoidedCheckTemplate
      .replace('{@EMAIL}', user.email)
      .replace('{@FirstName}', user.firstName)
      .replace('{@LastName}', user.lastName)
      .replace('{@Email}', user.email)
      .replace('{@LINK}', link);

    await SendHtmlEmail(
      emailConfig.HONEYCOMB_EMAIL,
      `User ${user.email} has uploaded a check image`,
      template,
      [],false,['joe@honeycombcredit.com']
    );

    this.slackService.publishMessage({
      message: `voided check uploaded for ${user.email}`,
      slackChannelId: slackConfig.VOIDED_CHECK.ID,
      url: `${link}`,
      btnText: 'View Document'
    })

    return true;
  }
}

export default UploadVoidedCheckUseCase;
