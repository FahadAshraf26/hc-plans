import { ICreateCampaignFundUseCase } from '@application/CampaignFund/createCampaignFund/ICreateCampaignFundUseCase';
import { IUserService, IUserServiceId } from '@application/User/IUserService';
import UserRemainingInvestmentLimitDTO from '@application/User/UserRemainingInvestmentLimitDTO';
import {
  ICampaignFundRepository,
  ICampaignFundRepositoryId,
} from '@domain/Core/CampaignFunds/ICampaignFundRepository';
import CampaignFundDomainService from '@domain/Core/CampaignFunds/Services/CampaignFundService';
import TransactionType from '@domain/Core/CampaignFunds/TransactionType';
import Charge from '@domain/Core/Charge/Charge';
import {
  IChargeRepository,
  IChargeRepositoryId,
} from '@domain/Core/Charge/IChargeRepository';
import {
  IGlobalHoneycombConfigurationRepository,
  IGlobalHoneycombConfigurationRepositoryId,
} from '@domain/Core/GlobalHoneycombConfiguration/IGlobalHoneycombConfigurationRepository';
import {
  IHoneycombDwollaCustomerRepository,
  IHoneycombDwollaCustomerRepositoryId,
} from '@domain/Core/HoneycombDwollaCustomer/IHoneycombDwollaCustomerRepository';
import { KycStatus } from '@domain/Core/ValueObjects/KycStatus';
import HttpError from '@infrastructure/Errors/HttpException';
import { IDwollaService, IDwollaServiceId } from '@infrastructure/Service/IDwollaService';
import { inject, injectable } from 'inversify';
import { campaignFundEntity } from './Utils/CampaignFundEntity';
import { IBankCharge, IBankChargeId } from './Utils/IBankCharge';
import { ICampaignEvents, ICampaignEventsId } from './Utils/ICampaignEvents';
import { ICampaignFundNPA, ICampaignFundNPAId } from './Utils/ICampaignFundNPA';
import {
  ICampaignMeetsCriteria,
  ICampaignMeetsCriteriaId,
} from './Utils/ICampaignMeetsCriteria';
import { ICardCharge, ICardChargeId } from './Utils/ICardCharge';
import {
  ICheckTransactionLimit,
  ICheckTransactionLimitId,
} from './Utils/ICheckTransactionLimit';
import {
  IFetchEntitiesFromDatabase,
  IFetchEntitiesFromDatabaseId,
} from './Utils/IFetchEntitiesFromDatabase';
import {
  IFundSlackNotification,
  IFundSlackNotificationId,
} from './Utils/IFundSlackNotification';
import { IHybridCharge, IHybridChargeId } from './Utils/IHybridCharge';
import {
  IInvestorMeetsCriteria,
  IInvestorMeetsCriteriaId,
} from './Utils/IInvestorMeetsCriteria';
import { IWalletCharge, IWalletChargeId } from './Utils/IWalletCharge';
import {
  ISlackService,
  ISlackServiceId,
} from '@infrastructure/Service/Slack/ISlackService';
import slack from '@infrastructure/Config/slack';
import { IePayCharge, IePayChargeId } from './Utils/IePayCharge';
import InvestmentAmount from '@domain/Core/CampaignFunds/InvestmentAmount';

@injectable()
class CreateCampaignFundUseCase implements ICreateCampaignFundUseCase {
  constructor(
    @inject(ICampaignFundRepositoryId) private fundRepository: ICampaignFundRepository,
    @inject(IChargeRepositoryId) private chargeRepository: IChargeRepository,
    @inject(IGlobalHoneycombConfigurationRepositoryId)
    private globalHoneycombConfigurationRepository: IGlobalHoneycombConfigurationRepository,
    @inject(IBankChargeId) private bankCharge: IBankCharge,
    @inject(ICampaignEventsId) private campaignEvents: ICampaignEvents,
    @inject(IFetchEntitiesFromDatabaseId)
    private fetchEntitiesFromDatabase: IFetchEntitiesFromDatabase,
    @inject(IInvestorMeetsCriteriaId)
    private investorMeetsCriteria: IInvestorMeetsCriteria,
    @inject(ICampaignMeetsCriteriaId)
    private campaignMeetsCriteria: ICampaignMeetsCriteria,
    @inject(IWalletChargeId) private walletCharge: IWalletCharge,
    @inject(ICardChargeId) private cardCharge: ICardCharge,
    @inject(IFundSlackNotificationId) private slackNotification: IFundSlackNotification,
    @inject(ICampaignFundNPAId) private campaignFundNPA: ICampaignFundNPA,
    @inject(ICheckTransactionLimitId)
    private checkTransactionLimit: ICheckTransactionLimit,
    @inject(IUserServiceId) private userService: IUserService,
    @inject(IHybridChargeId) private hybridCharge: IHybridCharge,
    @inject(IHoneycombDwollaCustomerRepositoryId)
    private honeycombDwollaCustomer: IHoneycombDwollaCustomerRepository,
    @inject(IDwollaServiceId) private dwollaService: IDwollaService,
    @inject(ISlackServiceId) private slackService: ISlackService,
    @inject(IePayChargeId) private ePayCharge: IePayCharge,
  ) {}

  async chargeInvestor({ dto, campaign, user, paymentOption, investmentType }) {
    let transactionAmount = 0;
    let walletAmount = 0;
    let referenceNumber = null;
    let transferId = null;
    let clientSecret = null;
    let walletTransferId = null;
    let fee = 0;
    let feePercentage = 0;
    let fixedFee = 0;
    let netAmount = 0;
    let charge;

    const globalConfiguration = await this.globalHoneycombConfigurationRepository.fetchLatestRecord();

    const numberOfPromotionCreditsInvestments = await this.fundRepository.countPromotionCreditsInvesments(
      dto.InvestorId(),
    );

    dto.setNumberOfPromotionCreditsInvestments(numberOfPromotionCreditsInvestments);

    const feeTransactionType =
      dto.TransactionType() === TransactionType.GooglePay().getValue() ||
      dto.TransactionType() === TransactionType.ApplePay().getValue()
        ? TransactionType.CreditCard().getValue()
        : dto.TransactionType();

    feePercentage = dto.IsMobilePlatform()
      ? 0
      : globalConfiguration.configuration[feeTransactionType].transactionFeeVarriable;
    fixedFee = dto.IsMobilePlatform()
      ? 0
      : globalConfiguration.configuration[feeTransactionType].transcationFeeFixed;
    const totalFee = globalConfiguration.CalculateFee(
      dto.Amount()._value,
      feeTransactionType,
      dto.IsMobilePlatform(),
    );
    let stripeFee: number;
    if (
      dto.TransactionType() === TransactionType.ACH().getValue() ||
      dto.TransactionType() === TransactionType.Wallet().getValue() ||
      dto.TransactionType() === TransactionType.Hybrid().getValue()
    ) {
      netAmount = dto.Amount()._value + totalFee;
    } else {
      stripeFee = ((totalFee + dto.Amount()._value) * 2.9) / 100 + 0.3;
      const newNetAmount = totalFee + dto.Amount()._value - stripeFee;
      netAmount = newNetAmount;
    }

    if (dto.IsMobilePlatform()) {
      netAmount = dto.Amount()._value;
    }

    const campaignFund = campaignFundEntity(
      dto,
      paymentOption,
      user,
      investmentType,
      netAmount,
    );
    await this.checkTransactionLimit.execute(dto, campaignFund);

    await this.fundRepository.add(campaignFund);
    transactionAmount = campaignFund.Amount();

    const honeycombDwollaCustomer = await this.honeycombDwollaCustomer.fetchByCustomerTypeAndUser(
      user.userId,
      'Personal',
    );

    if (honeycombDwollaCustomer) {
      const walletBalance = await this.dwollaService.retrieveFundingSourceBalance(
        honeycombDwollaCustomer.getDwollaBalanceId(),
      );
      walletAmount = walletBalance.balance.value;
      if (dto.TransactionType() === TransactionType.Hybrid().getValue()) {
        transactionAmount = campaignFund.Amount() - walletBalance.balance.value;
        fee = campaign.isChargeFee ? totalFee : fee;
        const result = await this.hybridCharge.execute({
          dto,
          campaign,
          user,
          paymentOption,
          transactionAmount: campaignFund.Amount(),
          campaignFund,
          honeycombFee: fee,
          walletBalance,
          honeycombDwollaCustomer,
          dwollaService: this.dwollaService,
        });
        if (result) {
          referenceNumber = result.referenceNumber;
          transferId = result.transferId;
        } else {
          await this.fundRepository.remove(campaignFund);
        }
      }

      if (dto.TransactionType() === TransactionType.Wallet().getValue()) {
        if (transactionAmount > walletBalance.balance.value) {
          throw new Error('Your Wallet Amount is low.');
        }

        walletAmount = transactionAmount;
        fee = campaign.isChargeFee ? totalFee : fee;
        const result = await this.walletCharge.execute({
          user,
          walletAmount,
          campaignFund,
          campaign,
          paymentOption,
          dto,
        });
        if (result) {
          walletTransferId = result;
        } else {
          await this.fundRepository.remove(campaignFund);
        }
      }
    }

    if (dto.TransactionType() === TransactionType.ACH().getValue()) {
      fee = campaign.isChargeFee ? totalFee : fee;
      let amountToCharge = (transactionAmount + fee).toFixed(2);
      const result = await this.bankCharge.execute({
        dto,
        campaign,
        user,
        paymentOption,
        amountToCharge,
        transactionAmount,
        campaignFund,
        honeycombFee: fee,
      });

      if (result) {
        referenceNumber = result.referenceNumber;
        transferId = result.transferId;
      } else {
        await this.fundRepository.remove(campaignFund);
      }
    }

    if (dto.TransactionType() === TransactionType.CreditCard().getValue()) {
      fee = campaign.isChargeStripe ? totalFee : fee;
      let amountToCharge = (transactionAmount + fee).toFixed(2);
      const result = await this.cardCharge.execute({
        dto,
        campaign,
        user,
        paymentOption,
        amountToCharge,
        transactionAmount,
        campaignFund,
        fee,
        stripeFee,
      });

      if (result) {
        referenceNumber = result.referenceNumber;
        transferId = result.transferId;
      } else {
        await this.fundRepository.remove(campaignFund);
      }
    }

    if (
      dto.TransactionType() === TransactionType.GooglePay().getValue() ||
      dto.TransactionType() === TransactionType.ApplePay().getValue()
    ) {
      fee = campaign.isChargeStripe ? totalFee : fee;
      let amountToCharge = (transactionAmount + fee).toFixed(2);
      const result = await this.ePayCharge.execute({
        campaign,
        user,
        amountToCharge,
        transactionAmount,
        campaignFund,
        fee,
        dto,
        stripeFee,
      });

      if (result) {
        transferId = result.transferId;
        referenceNumber = result.referenceNumber;
        clientSecret = result.clientSecret;
      } else {
        await this.fundRepository.remove(campaignFund);
      }
    }

    if (transferId || walletTransferId) {
      if (
        dto.TransactionType() === TransactionType.ACH().getValue() &&
        dto.TransactionType() === TransactionType.CreditCard().getValue() &&
        dto.TransactionType() === TransactionType.GooglePay().getValue() &&
        dto.TransactionType() === TransactionType.ApplePay().getValue()
      ) {
        charge = Charge.createFromDetail(transferId, undefined, fee);
        charge.setReferenceNumber(referenceNumber);
      } else {
        charge = Charge.createFromDetail('0', undefined, fee);
      }
      await this.chargeRepository.add(charge);
      campaignFund.setChargeId(charge.chargeId);
      campaignFund.setCharge(charge);

      if (dto.canAvailPromotionCredits()) {
        campaignFund.setPromotionCredits();
        campaignFund.setAmount(dto.Amount()._value + dto.PromotionAmount());
        campaignFund.setNetAmount(campaignFund.NetAmount() + dto.PromotionAmount());
      }

      await this.fundRepository.update(campaignFund);

      this.campaignEvents.sendEmailsToInvestors({
        dto,
        user: JSON.parse(JSON.stringify(user)),
        campaign,
        fee,
        feePercentage: Number(fee) > 0 ? parseFloat(feePercentage.toString()) : 0,
        transactionAmount,
        walletAmount,
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
          wallet: walletAmount,
          ach: transactionAmount,
        },
        dto.canAvailPromotionCredits(),
      );
    }

    if (clientSecret)
      return {
        status: 'success',
        data: clientSecret,
      };

    return {
      status: 'success',
      message: 'campaign fund created successfully',
    };
  }

  async execute(dto) {
    const {
      user,
      campaign,
      paymentOption,
    } = await this.fetchEntitiesFromDatabase.fetchEntitiesFromDatabase(dto);
    try {
      const amount = InvestmentAmount.createFormValue(
        dto.Amount(),
        campaign.investmentConfiguration.minAmount,
      );

      dto.Amount = function () {
        return amount;
      };
      if (user.isVerified !== KycStatus.PASS) {
        throw new HttpError(
          400,
          'You are not able to invest. Please verify the user identity first',
        );
      }
      const input = new UserRemainingInvestmentLimitDTO(user.userId);
      const remainingLimit = await this.userService.getUserRemainingInvestmentLimit(
        input,
      );

      if (remainingLimit !== 'unlimited') {
        if (dto.Amount()._value > remainingLimit) {
          throw new HttpError(
            400,
            'You are not able to invest.Your max invest limit exceeded',
          );
        }
      }

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
      await this.campaignMeetsCriteria.validateCampaignMeetsCriteria(
        campaign,
        campaignFundService,
      );

      const [
        campaignAccreditedRaised,
        campaignNonAccreditedRaised,
      ] = await this.campaignMeetsCriteria.getSumOfInvestmentGroupByInvestmentType(
        campaign.campaignId,
      );

      const goalsReached = campaignFundService.haveAnyGoalsBeenReached(
        campaignAccreditedRaised,
        campaignNonAccreditedRaised,
      );

      await this.campaignEvents
        .handleEvents({ fundsService: campaignFundService, goalsReached })
        .catch((err) => {
          console.error(err);
        });

      const response = await this.chargeInvestor({
        dto,
        campaign,
        user,
        paymentOption,
        investmentType,
      });

      if (
        campaign.investmentType !== 'SAFE' &&
        campaign.investmentType !== 'SAFE - DISCOUNT' &&
        campaign.investmentType !== 'Equity (LLC)'
      ) {
        this.campaignFundNPA.execute(dto, JSON.parse(JSON.stringify(user)), campaign);
      }

      return response;
    } catch (error) {
      await this.slackService.publishMessage({
        message: `Investor: *(${user.getFullName()})* - Campaign: *(${
          campaign.campaignName
        })* - ${error.message}`,
        slackChannelId: slack.INVESTMENT_ERROR.ID,
      });
      throw new HttpError(400, error.message);
    }
  }
}

export default CreateCampaignFundUseCase;
