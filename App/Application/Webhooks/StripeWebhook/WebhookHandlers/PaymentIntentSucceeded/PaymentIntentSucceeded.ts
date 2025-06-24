import {
  ICampaignFundRepository,
  ICampaignFundRepositoryId,
} from '@domain/Core/CampaignFunds/ICampaignFundRepository';
import {
  IChargeRepository,
  IChargeRepositoryId,
} from '@domain/Core/Charge/IChargeRepository';
import {
  IHybridTransactionRepoistory,
  IHybridTransactionRepoistoryId,
} from '@domain/Core/HybridTransactions/IHybridTransactionRepository';
import { inject, injectable } from 'inversify';
import { IPaymentIntentSucceeded } from './IPaymentIntentSucceeded';
import { ChargeStatus } from '@domain/Core/ValueObjects/ChargeStatus';
import {
  ISlackService,
  ISlackServiceId,
} from '@infrastructure/Service/Slack/ISlackService';
import config from '@infrastructure/Config';
import { IInvestorDao, IInvestorDaoId } from '@domain/Core/Investor/IInvestorDao';
import { IUserRepository, IUserRepositoryId } from '@domain/Core/User/IUserRepository';
import {
  ICampaignRepository,
  ICampaignRepositoryId,
} from '@domain/Core/Campaign/ICampaignRepository';
const { slackConfig } = config;

@injectable()
class PaymentIntentSucceeded implements IPaymentIntentSucceeded {
  constructor(
    @inject(IHybridTransactionRepoistoryId)
    private hybridTransactionRepository: IHybridTransactionRepoistory,
    @inject(ICampaignFundRepositoryId)
    private campaignFundRepository: ICampaignFundRepository,
    @inject(IChargeRepositoryId) private chargeRepository: IChargeRepository,
    @inject(IInvestorDaoId) private investorDAO: IInvestorDao,
    @inject(IUserRepositoryId) private userRepository: IUserRepository,
    @inject(ICampaignRepositoryId) private campaignRepository: ICampaignRepository,
    @inject(ISlackServiceId) private slackService: ISlackService,
  ) {}

  async execute(eventData) {
    if (eventData.customer) {
      await this.personalUser(eventData);
    } else {
      await this.businessUser(eventData);
    }
  }

  async personalUser(eventData) {
    const hybridTransactions = await this.hybridTransactionRepository.fetchOneByCustomCritera(
      {
        whereConditions: {
          tradeId: eventData.id,
        },
      },
    );

    if (hybridTransactions) {
      const newHybridTransaction = {
        ...hybridTransactions,
        status: ChargeStatus.SUCCESS,
      };

      await this.hybridTransactionRepository.update(newHybridTransaction);
      const campaignFund = await this.campaignFundRepository.fetchById(
        hybridTransactions.campaignFundId,
      );
      if (campaignFund) {
        const charge = await this.chargeRepository.fetchById(campaignFund.ChargeId());
        if (charge) {
          const newCharge = {
            ...charge,
            chargeStatus: ChargeStatus.SUCCESS,
          };
          await this.chargeRepository.update(newCharge);
        }
      }
    }
  }

  async businessUser(eventData) {
    const charges = eventData.charges;
    const data = charges.data[0];
    const billingDetails = data.billing_details;
    this.slackService.publishMessage({
      message: `*${billingDetails.email}* *$${
        data.amount / 100
      }* paid successfully using payment link.`,
      slackChannelId: slackConfig.STRIPE_PAYMENT.ID,
    });
  }
}

export default PaymentIntentSucceeded;
