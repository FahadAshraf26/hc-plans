import Stripe from 'stripe';
import Config from '@infrastructure/Config';
import { ISlackService, ISlackServiceId } from '../Slack/ISlackService';
import slack from '@infrastructure/Config/slack';
import { IStripeService } from './IStripeService';
import { inject, injectable } from 'inversify';
import { CampaignEscrow } from '@domain/Core/ValueObjects/CampaignEscrow';
import { toCents } from '@infrastructure/Utils/toCents';
const { stripe } = Config;

@injectable()
class StripeService implements IStripeService {
  private stripeClient: Stripe;
  constructor(@inject(ISlackServiceId) private slackService: ISlackService) {
    this.stripeClient = new Stripe(stripe.STRIPE_SECRET_KEY, {
      apiVersion: '2022-11-15',
    });
  }

  async createCustomer(user) {
    try {
      const {
        email,
        userName,
        address,
        city,
        state,
        zipCode,
        country,
        phoneNumber,
        stripeCustomerId,
      } = user;
      if (stripeCustomerId) {
        return;
      }
      const params: Stripe.CustomerCreateParams = {
        email,
        name: `${user.firstName} ${user.lastName}`,
        address: {
          city,
          state,
          country,
          line1: address,
          postal_code: zipCode,
        },
        phone: phoneNumber,
      };
      const result = await this.stripeClient.customers.create(params);
      return result;
    } catch (error) {
      await this.slackService.publishMessage({
        message: `Stripe Create Customer: ${error}`,
        slackChannelId: slack.ERROS.ID,
      });
      throw new Error(error);
    }
  }

  async attachCardWithCustomer(customerId: string, paymentMethodId: string) {
    try {
      const result = await this.stripeClient.paymentMethods.attach(paymentMethodId, {
        customer: customerId,
      });
      return result;
    } catch (error) {
      await this.slackService.publishMessage({
        message: `Attach Customer Card: ${error}`,
        slackChannelId: slack.ERROS.ID,
      });
      throw new Error(error);
    }
  }

  async externalFundMovement(
    amount,
    stripeCustomerId,
    description,
    campaignId,
    campaignName,
    stripePaymentCardId,
    campaignEscrowType,
    stripeFee
  ) {
    try {
      const params: Stripe.PaymentIntentCreateParams = {
        amount,
        currency: 'usd',
        customer: stripeCustomerId,
        description,
        metadata: { 'Campaign ID': campaignId, 'Offering Name': campaignName },
        payment_method_types: ['card'],
        payment_method: stripePaymentCardId,
        confirm: true,
        off_session: true,
      };
      const response = await this.stripeClient.paymentIntents.create(params);
      return {
        transactionId: response.id,
        status: response.status,
      };
    } catch (error) {
      await this.slackService.publishMessage({
        message: `${error}`,
        slackChannelId: slack.INVESTMENT_ERROR.ID,
      });
    }
  }

  async refundInvestment(paymentIntentId: string, investmentAmount: number) {
    try {
      const result = await this.stripeClient.refunds.create({
        payment_intent: paymentIntentId,
        amount: parseInt((investmentAmount * 100).toString()),
      });

      return result;
    } catch (error) {
      await this.slackService.publishMessage({
        message: `Error refunding investment: ${error}`,
        slackChannelId: slack.INVESTMENT_ERROR.ID,
      });
      throw new Error(`Error refunding investment: ${error}`);
    }
  }

  async cancelPayment(paymentIntentId: string) {
    try {
      const result = await this.stripeClient.paymentIntents.cancel(paymentIntentId);
      return result;
    } catch (error) {
      await this.slackService.publishMessage({
        message: `Error cancelling payment: ${error}`,
        slackChannelId: slack.INVESTMENT_ERROR.ID,
      });
      throw new Error(`Error cancelling payment: ${error}`);
    }
  }

  async createPaymentIntentforEpay(
    amount: number,
    stripeCustomerId: string,
    description: string,
    campaignId: string,
    campaignName: string,
    campaignEscrowType,
    stripeFee
  ) {
    try {

      const params: Stripe.PaymentIntentCreateParams = {
        amount,
        currency: 'usd',
        customer: stripeCustomerId,
        description,
        metadata: { 'Campaign ID': campaignId, 'Offering Name': campaignName },
        automatic_payment_methods: { enabled: true },
      };
      const response = await this.stripeClient.paymentIntents.create(params);
      return response;
    } catch (error) {
      await this.slackService.publishMessage({
        message: `Error creating payment intent for google/apple pay: ${error}`,
        slackChannelId: slack.INVESTMENT_ERROR.ID,
      });
      throw new Error(`Error creating payment intent for google/apple pay: ${error}`);
    }
  }

  async getTransactionStatus(paymentIntentId: string) {
    try {
      const paymentIntent = await this.stripeClient.paymentIntents.retrieve(paymentIntentId);
      return paymentIntent.status;
    } catch (error) {
      await this.slackService.publishMessage({
        message: `Error fetching transaction status: ${error}`,
        slackChannelId: slack.INVESTMENT_ERROR.ID,
      });
      throw new Error(`Error fetching transaction status: ${error}`);
    }
  }
}

export default StripeService;
