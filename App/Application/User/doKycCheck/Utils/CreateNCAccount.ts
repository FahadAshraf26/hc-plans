import { IUserRepository, IUserRepositoryId } from '@domain/Core/User/IUserRepository';
// import { northCapitalService } from '@infrastructure/Service/PaymentProcessor';
import {
  ISlackService,
  ISlackServiceId,
} from '@infrastructure/Service/Slack/ISlackService';
import { inject, injectable } from 'inversify';
import { ICreateNCAccount } from './ICreateNCAccount';
import {
  IInvestorPaymentOptionsRepository,
  IInvestorPaymentOptionsRepositoryId,
} from '@domain/InvestorPaymentOptions/IInvestorPaymentOptionsRepository';
import Config from '@infrastructure/Config';

const { slackConfig } = Config;

@injectable()
class CreateNCAccount implements ICreateNCAccount {
  constructor(
    @inject(ISlackServiceId) private slackService: ISlackService,
    @inject(IUserRepositoryId) private userRepository: IUserRepository,
    @inject(IInvestorPaymentOptionsRepositoryId)
    private investorPaymentOptionRepository: IInvestorPaymentOptionsRepository,
  ) {}
  async createUserPartyAndAccount(user) {
    let partyId = user.ncPartyId;
    // if (!partyId) {
    // partyId = await northCapitalService.createParty(user);
    // }

    // let accountId = user.investor.ncAccountId;
    // if (!accountId) {
    // accountId = await northCapitalService.createAccount(user);
    // await northCapitalService.calculateSuitability(accountId);
    // await northCapitalService.createLink({
    //   firstEntityType: 'Account',
    //   firstEntityId: accountId,
    //   relatedEntityType: 'IndivACParty',
    //   relatedEntityId: partyId,
    //   linkType: 'member',
    //   isPrimary: true,
    // });
    // }

    // if (!partyId && !accountId) {
    //   this.slackService.publishMessage({
    //     message: `NC_USER_EVENT: Unable to create account on north capital`,
    //     slackChannelId: slackConfig.ERROS.ID,
    //   });
    //   return;
    // }
    // user.ncPartyId = partyId;
    // user.investor.ncAccountId = accountId;
    await this.userRepository.update(user);

    // const paymentOptions = await this.investorPaymentOptionRepository.fetchInvestorBank(
    //   user.InvestorId(),
    // );
    // if (paymentOptions && paymentOptions.getBank()) {
    // await northCapitalService.createInvestorExternalAccount({
    //   accountId: user.NcAccountId(),
    //   investorName: `${user.firstName} ${user.lastName}`,
    //   nickName: `${paymentOptions.getBank().getAccountType()} account`,
    //   routingNumber: `${paymentOptions.getBank().getRoutingNumber()}`,
    //   accountNumber: `${paymentOptions.getBank().getAccountNumber()}`,
    //   ip: '',
    //   accountType: `${paymentOptions.getBank().getAccountType()}`,
    // });
    // }
  }
}

export default CreateNCAccount;
