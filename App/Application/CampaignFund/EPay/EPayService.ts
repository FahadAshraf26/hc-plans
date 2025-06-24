import { CampaignEscrow } from '@domain/Core/ValueObjects/CampaignEscrow';
import {
  IStripeService,
  IStripeServiceId,
} from '@infrastructure/Service/Stripe/IStripeService';
import { inject, injectable } from 'inversify';
import { IePay } from './IePay';
import HttpError from '@infrastructure/Errors/HttpException';
import { toCents } from '@infrastructure/Utils/toCents';
import {
  IFetchEntitiesFromDatabase,
  IFetchEntitiesFromDatabaseId,
} from '@application/CampaignFund/createCampaignFund/Utils/IFetchEntitiesFromDatabase';
import {
  IGlobalHoneycombConfigurationRepository,
  IGlobalHoneycombConfigurationRepositoryId,
} from '@domain/Core/GlobalHoneycombConfiguration/IGlobalHoneycombConfigurationRepository';
import TransactionType from '@domain/Core/CampaignFunds/TransactionType';
import { campaignFundEntity } from '../createCampaignFund/Utils/CampaignFundEntity';
import CampaignFundDomainService from '@domain/Core/CampaignFunds/Services/CampaignFundService';
import {
  IInvestorMeetsCriteria,
  IInvestorMeetsCriteriaId,
} from '../createCampaignFund/Utils/IInvestorMeetsCriteria';
import {
  ICampaignFundRepository,
  ICampaignFundRepositoryId,
} from '@domain/Core/CampaignFunds/ICampaignFundRepository';
import HybridTransaction from '@domain/Core/HybridTransactions/HybridTransaction';
import {
  IHybridTransactionRepoistory,
  IHybridTransactionRepoistoryId,
} from '@domain/Core/HybridTransactions/IHybridTransactionRepository';
import Charge from '@domain/Core/Charge/Charge';
import {
  IChargeRepository,
  IChargeRepositoryId,
} from '@domain/Core/Charge/IChargeRepository';
import {
  ICampaignEvents,
  ICampaignEventsId,
} from '../createCampaignFund/Utils/ICampaignEvents';
import {
  ISlackService,
  ISlackServiceId,
} from '@infrastructure/Service/Slack/ISlackService';
import {
  IFundSlackNotification,
  IFundSlackNotificationId,
} from '../createCampaignFund/Utils/IFundSlackNotification';
import slack from '@infrastructure/Config/slack';
import logger from '@infrastructure/Logger/logger';
import InvestmentAmount from '@domain/Core/CampaignFunds/InvestmentAmount';

@injectable()
export class EPayService implements IePay {
  constructor(
    @inject(IStripeServiceId) private stripeService: IStripeService,
    @inject(IFetchEntitiesFromDatabaseId)
    private fetchEntitiesFromDatabase: IFetchEntitiesFromDatabase,
    @inject(IGlobalHoneycombConfigurationRepositoryId)
    private globalHoneycombConfigurationRepository: IGlobalHoneycombConfigurationRepository,
    @inject(IInvestorMeetsCriteriaId)
    private investorMeetsCriteria: IInvestorMeetsCriteria,
    @inject(ICampaignFundRepositoryId) private fundRepository: ICampaignFundRepository,
    @inject(IHybridTransactionRepoistoryId)
    private hybridTransactionRepository: IHybridTransactionRepoistory,
    @inject(IChargeRepositoryId) private chargeRepository: IChargeRepository,
    @inject(ICampaignEventsId) private campaignEvents: ICampaignEvents,
    @inject(ISlackServiceId) private slackService: ISlackService,
    @inject(IFundSlackNotificationId) private slackNotification: IFundSlackNotification,
  ) {}

  private async sendErrorToSlack(
    methodName: string,
    dto: any,
    error: any,
    user?: any,
    campaign?: any,
  ) {
    try {
      const campaignName = (campaign && campaign.campaignName) || 'N/A';
      const userName = user && user.getFullName ? user.getFullName() : 'Unknown User';
      const transferId = dto.TransferId ? dto.TransferId() : 'N/A';

      const message = `EPayService.${methodName} Error - Investor: *(${userName})* - Campaign: *(${campaignName})* - TransferId: *(${transferId})* - ${error.message}`;

      await this.slackService.publishMessage({
        message: message,
        slackChannelId: slack.INVESTMENT_ERROR.ID,
      });
    } catch (slackError) {
      // If Slack notification fails, just log it
      logger.error(`Error sending slack notification for ${methodName}:`, slackError);
    }
  }

  generateClientSecret = async ({ dto }) => {
    try {
      const {
        user,
        campaign,
      } = await this.fetchEntitiesFromDatabase.fetchEntitiesFromDatabase(dto);
      const globalConfiguration = await this.globalHoneycombConfigurationRepository.fetchLatestRecord();
      const amount = InvestmentAmount.createFormValue(
        dto.Amount(),
        campaign.investmentConfiguration.minAmount,
      );
      dto.Amount = function () {
        return amount;
      };
      const feeTransactionType =
        dto.TransactionType() === TransactionType.GooglePay().getValue() ||
        dto.TransactionType() === TransactionType.ApplePay().getValue()
          ? TransactionType.CreditCard().getValue()
          : dto.TransactionType();
      let amountToCharge = dto.Amount()._value;
      let stripeFee: number = 0;
      const totalFee = globalConfiguration.CalculateFee(
        dto.Amount()._value,
        feeTransactionType,
        dto.IsMobilePlatform(),
      );
      let transferId: string, referenceNumber: string, clientSecret: string;
      if (campaign.isChargeStripe) {
        stripeFee = ((totalFee + dto.Amount()._value) * 2.9) / 100 + 0.3;
        amountToCharge = totalFee + dto.Amount()._value;
      } else {
        amountToCharge = dto.Amount()._value;
      }
      
      if (campaign.escrowType === CampaignEscrow.THREAD_BANK) {
        const description = `investment in ${campaign.campaignName}`;
        const response = await this.stripeService.createPaymentIntentforEpay(
          toCents(amountToCharge),
          user.stripeCustomerId,
          description,
          campaign.campaignId,
          campaign.campaignName,
          campaign.escrowType,
          stripeFee,
        );
        transferId = response.id;
        referenceNumber = response.id;
        clientSecret = response.client_secret;
      }
      if (transferId === null) {
        throw new HttpError(400, 'TradeId cannot be null');
      }
      return { clientSecret, referenceNumber, transferId };
    } catch (error) {
      const {
        user,
        campaign,
      } = await this.fetchEntitiesFromDatabase.fetchEntitiesFromDatabase(dto);
      await this.sendErrorToSlack('generateClientSecret', dto, error, user, campaign);

      throw new HttpError(400, error.message || 'Failed to generate client secret');
    }
  };

  updateEPayTransactions = async ({ dto }) => {
    const {
      user,
      campaign,
      paymentOption,
    } = await this.fetchEntitiesFromDatabase.fetchEntitiesFromDatabase(dto);
    try {
      let netAmount = 0;
      let transactionAmount = 0;
      let fee = 0;
      let feePercentage = 0;
      let fixedFee = 0;
      let charge;

      const globalConfiguration = await this.globalHoneycombConfigurationRepository.fetchLatestRecord();
      const amount = InvestmentAmount.createFormValue(
        dto.Amount(),
        campaign.investmentConfiguration.minAmount,
      );
      dto.Amount = function () {
        return amount;
      };

      const numberOfPromotionCreditsInvestments = await this.fundRepository.countPromotionCreditsInvesments(
        dto.InvestorId(),
      );

      dto.setNumberOfPromotionCreditsInvestments(numberOfPromotionCreditsInvestments);

      const campaignFundService = CampaignFundDomainService.create({
        campaign,
        user,
        paymentOption,
        pledge: dto.Amount()._value,
        transactionType: dto.TransactionType(),
      });

      const investmentType = await this.investorMeetsCriteria.validateInvestorMeetsCriteria(
        dto,
        campaignFundService,
      );
      const feeTransactionType =
        dto.TransactionType() === TransactionType.GooglePay().getValue() ||
        dto.TransactionType() === TransactionType.ApplePay().getValue()
          ? TransactionType.CreditCard().getValue()
          : dto.TransactionType();
      let stripeFee: number = 0;
      const totalFee = globalConfiguration.CalculateFee(
        dto.Amount()._value,
        feeTransactionType,
        dto.IsMobilePlatform(),
      );
      if (campaign.isChargeStripe) {
        stripeFee = ((totalFee + dto.Amount()._value) * 2.9) / 100 + 0.3;
        const newNetAmount = totalFee + dto.Amount()._value - stripeFee;
        netAmount = newNetAmount;
      } else {
        netAmount = dto.Amount()._value;
      }
      
      feePercentage = dto.IsMobilePlatform()
        ? 0
        : globalConfiguration.configuration[feeTransactionType].transactionFeeVarriable;
      fixedFee = dto.IsMobilePlatform()
        ? 0
        : globalConfiguration.configuration[feeTransactionType].transcationFeeFixed;
      const campaignFund = campaignFundEntity(
        dto,
        paymentOption,
        user,
        investmentType,
        netAmount,
      );

      await this.fundRepository.add(campaignFund);
      transactionAmount = campaignFund.Amount();
      fee = campaign.isChargeFee ? totalFee : fee;
      charge = Charge.createFromDetail(dto.TransferId(), undefined, fee);
      charge.setReferenceNumber(dto.ReferenceId());
      await this.chargeRepository.add(charge);
      campaignFund.setChargeId(charge.chargeId);
      campaignFund.setCharge(charge);
      await this.fundRepository.update(campaignFund);

      const hybridBankTransaction = HybridTransaction.createFromDetails({
        amount: dto.canAvailPromotionCredits()
          ? transactionAmount + dto.PromotionAmount()
          : transactionAmount,
        transactionType: dto.TransactionType(),
        tradeId: dto.TransferId(),
        refrenceNumber: dto.ReferenceId(),
        dwollaTransactionId: null,
        individualACHId: null,
        applicationFee: fee,
        status: 'pending',
        source: CampaignEscrow.STRIPE,
      });

      hybridBankTransaction.setCampaignFundId(campaignFund.CampaignFundId());

      await this.hybridTransactionRepository.add(hybridBankTransaction);

      if (dto.canAvailPromotionCredits()) {
        campaignFund.setPromotionCredits();
        campaignFund.setAmount(dto.Amount()._value + dto.PromotionAmount());
        campaignFund.setNetAmount(campaignFund.NetAmount() + dto.PromotionAmount());
        await this.fundRepository.update(campaignFund);
      }

      this.campaignEvents.sendEmailsToInvestors({
        dto,
        user: JSON.parse(JSON.stringify(user)),
        campaign,
        fee,
        feePercentage: Number(fee) > 0 ? parseFloat(feePercentage.toString()) : 0,
        transactionAmount,
        walletAmount: 0,
        fixedFee,
      });
      const totalInvestments = await this.fundRepository.fetchSumInvestmentByCampaign(
        campaign.campaignId,
        undefined,
        true,
      );

      this.campaignEvents.sendIssuerInvestmentReceipt({
        issuer: campaign.issuer,
        user: JSON.parse(JSON.stringify(user)),
        campaignFund,
        totalInvestments,
      });
      this.slackNotification.execute(
        user,
        campaignFund,
        campaign,
        dto.TransactionType(),
        {
          wallet: 0,
          ach: transactionAmount,
        },
        dto.canAvailPromotionCredits(),
      );
    } catch (error) {
      await this.sendErrorToSlack('updateEPayTransactions', dto, error, user, campaign);
      throw new HttpError(400, error.message || 'Failed to update payment transaction');
    }
  };

  cancelPaymentIntent = async ({ dto }) => {
    try {
      await this.stripeService.cancelPayment(dto.TransferId());

      return { success: true, message: 'Payment intent cancelled successfully' };
    } catch (error) {
      console.error('Error cancelling payment intent:', error);
      await this.sendErrorToSlack('cancelPaymentIntent', dto, error);

      throw new HttpError(400, error.message || 'Failed to cancel payment intent');
    }
  };
}
