import { IUserRepository, IUserRepositoryId } from '@domain/Core/User/IUserRepository';
import {
  ISlackService,
  ISlackServiceId,
} from '@infrastructure/Service/Slack/ISlackService';
import { inject, injectable } from 'inversify';
import config from '@infrastructure/Config';
import { ICreatePartyWebhookHandler } from '@application/Webhooks/NorthCapital/webhookHandlers/createPartyWebhookHandler/ICreatePartyWebhookHandler';

const { northCapital, slackConfig } = config;

@injectable()
class CreatePartyWebhookHandler implements ICreatePartyWebhookHandler {
  constructor(
    @inject(IUserRepositoryId) private userRepository: IUserRepository,
    @inject(ISlackServiceId) private slackService: ISlackService,
    private baseUrlForPartyCheck = `${northCapital.webhookURL}/parties_overview_individual`,
  ) {}

  StrToBase64(string) {
    return Buffer.from(string).toString('base64');
  }

  async execute(event) {
    await new Promise((r) => setTimeout(r, 5000));

    const northCapitalUrl = `${this.baseUrlForPartyCheck}?party_id=${this.StrToBase64(
      event.payload().partyId,
    )}&clientid=${this.StrToBase64(
      northCapital.clientID,
    )}&developerkey=${this.StrToBase64(northCapital.developerAPIKey)}`;

    const user = await this.userRepository.fetchByNCPartyId(
      event.payload().partyId,
      false,
    );

    if (!user) {
      throw Error('user not found');
    }

    const message = `North Capital Party Created for ${user.email}.`;
    await this.slackService.publishMessage({
      message,
      url: northCapitalUrl,
      slackChannelId: slackConfig.NC_WEBHOOK.ID,
    });

    return true;
  }
}

export default CreatePartyWebhookHandler;
