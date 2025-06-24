import {
  ISlackService,
  ISlackServiceId,
} from '@infrastructure/Service/Slack/ISlackService';
import { inject, injectable } from 'inversify';
import Config from '@infrastructure/Config';
import { ICustomerCreated } from './ICustomerCreated';

const { slackConfig } = Config;

@injectable()
class CustomerCreated implements ICustomerCreated {
  constructor(@inject(ISlackServiceId) private slackService: ISlackService) {}

  async execute(eventData) {
    this.slackService.publishMessage({
      message: `Stripe Account Created for ${eventData.email}.`,
      slackChannelId: slackConfig.STRIPE_WEBHOOK.ID,
    });
  }
}

export default CustomerCreated;
