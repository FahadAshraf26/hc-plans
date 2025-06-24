import { IUserRepository, IUserRepositoryId } from '@domain/Core/User/IUserRepository';
import {
  ISlackService,
  ISlackServiceId,
} from '@infrastructure/Service/Slack/ISlackService';
import { inject, injectable } from 'inversify';
import config from '@infrastructure/Config';
import { ICreateAccountWebhookHandler } from '@application/Webhooks/NorthCapital/webhookHandlers/createAccountWebhookHandler/ICreateAccountWebhookHandler';
import {
  IUncaughtExceptionService,
  IUncaughtExceptionServiceId,
} from '@application/UncaughtException/IUncaughtExceptionService';

const { server, northCapital, slackConfig } = config;

const sandboxURL = 'api-sandboxdash.norcapsecurities.com';
const prodURL = 'api.norcapsecurities.com';

@injectable()
class CreateAccountWebhookHandler implements ICreateAccountWebhookHandler {
  constructor(
    @inject(IUserRepositoryId) private userRepository: IUserRepository,
    @inject(ISlackServiceId) private slackService: ISlackService,
    @inject(IUncaughtExceptionServiceId)
    private uncaughtException: IUncaughtExceptionService,
    private baseURLForAccountCheck = `https://${
      server.IS_PRODUCTION ? prodURL : sandboxURL
    }/admin_v3/client/accounts_overview_information`,
  ) {}

  StrToBase64(string) {
    return Buffer.from(string).toString('base64');
  }

  async execute(event) {
    try {
      const northCapitalUrl = `${
        this.baseURLForAccountCheck
      }?accountid=${this.StrToBase64(
        event.payload().accountId,
      )}&clientid=${this.StrToBase64(
        northCapital.clientID,
      )}&developerkey=${this.StrToBase64(northCapital.developerAPIKey)}`;
      const user = await this.userRepository.fetchByNCAccountId(
        event.payload().accountId,
        false,
      );

      if (!user) {
        return false;
      }

      const message = `North Capital Account Created for ${user.email}.`;
      await this.slackService.publishMessage({
        message,
        url: northCapitalUrl,
        slackChannelId: slackConfig.NC_WEBHOOK.ID,
      });

      return true;
    } catch (err) {
      await this.uncaughtException.logException(
        {
          event: event.payload(),
        },
        err,
      );
      return false;
    }
  }
}

export default CreateAccountWebhookHandler;
