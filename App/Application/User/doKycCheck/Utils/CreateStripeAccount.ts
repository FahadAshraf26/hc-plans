import { IUserRepository, IUserRepositoryId } from '@domain/Core/User/IUserRepository';
import {
  ISlackService,
  ISlackServiceId,
} from '@infrastructure/Service/Slack/ISlackService';
import { inject, injectable } from 'inversify';
import { ICreateStripeAccount } from './ICreateStripeAccount';
import Config from '@infrastructure/Config';
import {
  IStripeService,
  IStripeServiceId,
} from '@infrastructure/Service/Stripe/IStripeService';

const { slackConfig } = Config;

@injectable()
class CreateStripeAccount implements ICreateStripeAccount {
  constructor(
    @inject(ISlackServiceId) private slackService: ISlackService,
    @inject(IUserRepositoryId) private userRepository: IUserRepository,
    @inject(IStripeServiceId) private stripeService: IStripeService,
  ) {}

  async createCustomer(user) {
    if (user.stripeCustomerId !== null) {
      return;
    }
    const result = await this.stripeService.createCustomer(user);
    if (!result) {
      this.slackService.publishMessage({
        message: `STRIPE_USER_EVENT: Unable to create stripe account}`,
        slackChannelId: slackConfig.ERROS.ID,
      });
      return;
    }
    user.stripeCustomerId = result.id;
    await this.userRepository.update(user);
  }
}

export default CreateStripeAccount;
