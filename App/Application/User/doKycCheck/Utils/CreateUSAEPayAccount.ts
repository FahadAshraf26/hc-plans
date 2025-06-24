import { IUserRepository, IUserRepositoryId } from '@domain/Core/User/IUserRepository';
import { usaepayService } from '@infrastructure/Service/PaymentProcessor';
import {
  ISlackService,
  ISlackServiceId,
} from '@infrastructure/Service/Slack/ISlackService';
import { inject, injectable } from 'inversify';
import { ICreateUSAEPayAccount } from './ICreateUSAEPayAccount';
import Config from '@infrastructure/Config';

const { slackConfig } = Config;

@injectable()
class CreateUSAEPayAccount implements ICreateUSAEPayAccount {
  constructor(
    @inject(ISlackServiceId) private slackService: ISlackService,
    @inject(IUserRepositoryId) private userRepository: IUserRepository,
  ) {}

  async createFirstCitizenBankCustomer(user) {
    if (user.vcCustomerId && user.investor.vcCustomerKey) {
      return;
    }

    const firstCitizenBankResult = await usaepayService.createFirstCitizenBankCustomer(
      user,
    );
    if (!firstCitizenBankResult.customerId && !firstCitizenBankResult.customerKey) {
      this.slackService.publishMessage({
        message: `USAEPAY_USER_EVENT: Unable to create account on usa epay first citizen bank`,
        slackChannelId: slackConfig.ERROS.ID,
      });
    }

    user.vcCustomerId = firstCitizenBankResult.customerId;
    user.investor.vcCustomerKey = firstCitizenBankResult.customerKey;
    await this.userRepository.update(user);

    this.slackService.publishMessage({
      message: `USAEpay First Citizen Bank Account Created for ${user.email}.`,
      slackChannelId: slackConfig.USAEPAY_WEBHOOK.ID,
    });
  }

  async createThreadBankCustomer(user) {
    if (user.vcThreadBankCustomerId && user.investor.vcThreadBankCustomerKey) {
      return;
    }

    const threadBankResult = await usaepayService.createThreadBankCustomer(user);
    if (!threadBankResult.customerId && !threadBankResult.customerKey) {
      this.slackService.publishMessage({
        message: `USAEPAY_USER_EVENT: Unable to create account on usa epay thread bank`,
        slackChannelId: slackConfig.ERROS.ID,
      });
    }

    user.vcThreadBankCustomerId = threadBankResult.customerId;
    user.investor.vcThreadBankCustomerKey = threadBankResult.customerKey;
    await this.userRepository.update(user);

    this.slackService.publishMessage({
      message: `USAEpay Thread Bank Account Created for ${user.email}.`,
      slackChannelId: slackConfig.USAEPAY_WEBHOOK.ID,
    });
  }
}

export default CreateUSAEPayAccount;
