import {
  ICampaignMediaRepository,
  ICampaignMediaRepositoryId,
} from '@domain/Core/CamapignMedia/ICampaignMediaRepository';
import CampaignFundDomainService from '@domain/Core/CampaignFunds/Services/CampaignFundService';
import TransactionType from '@domain/Core/CampaignFunds/TransactionType';
import {
  IGlobalHoneycombConfigurationRepository,
  IGlobalHoneycombConfigurationRepositoryId,
} from '@domain/Core/GlobalHoneycombConfiguration/IGlobalHoneycombConfigurationRepository';
import {
  IIssuerRepository,
  IIssuerRepositoryId,
} from '@domain/Core/Issuer/IIssuerRepository';
import {
  IInvestorPaymentOptionsRepository,
  IInvestorPaymentOptionsRepositoryId,
} from '@domain/InvestorPaymentOptions/IInvestorPaymentOptionsRepository';
import emailTemplates from '@domain/Utils/EmailTemplates';
import config from '@infrastructure/Config';
import mailService from '@infrastructure/Service/MailService';
import TimeUtil from '@infrastructure/Utils/TimeUtil';
import dollarFormatter from '@infrastructure/Utils/dollarFormatter';
import { inject, injectable } from 'inversify';
import emoji from 'node-emoji';
import { ICampaignEvents } from './ICampaignEvents';
import { CampaignEscrow } from '@domain/Core/ValueObjects/CampaignEscrow';

const { emailConfig, google, server } = config;
const { SendHtmlEmail } = mailService;
const {
  campaignGoalReachedTemplate,
  campaignMinimumGoalReachedTemplate,
  campaignHalfMinimumGoalReachedTemplate,
  commitmentReceiptTemplate,
  newIssuerInvestmentTemplate,
  hybridCommitmentReceiptTemplate,
  promoCommitmentReceiptTemplate,
  promoHybridCommitmentReceiptTemplate,
} = emailTemplates;

type handleEventOption = {
  fundsService?: CampaignFundDomainService;
  goalsReached?: any;
};

@injectable()
class CampaignEvents implements ICampaignEvents {
  constructor(
    @inject(IGlobalHoneycombConfigurationRepositoryId)
    private globalHoneycombConfigurationRepository: IGlobalHoneycombConfigurationRepository,
    @inject(IIssuerRepositoryId) private issuerRepository: IIssuerRepository,
    @inject(IInvestorPaymentOptionsRepositoryId)
    private investorPaymentOptionsRepository: IInvestorPaymentOptionsRepository,
    @inject(ICampaignMediaRepositoryId)
    private campaignMediaRepository: ICampaignMediaRepository,
  ) {}

  financial(x) {
    return Number.parseFloat(x) % 1 === 0
      ? Number.parseFloat(x).toFixed(0)
      : Number.parseFloat(x)
          .toFixed(2)
          .replace(/(\.[0-9]*[1-9])0+$|\.0*$/, '$1');
  }

  handleEvents = async ({ fundsService, goalsReached }: handleEventOption) => {
    const campaign = fundsService.campaign;
    const data = await this.globalHoneycombConfigurationRepository.fetchLatestRecord();
    const events = goalsReached;

    const emailHtmls = {};
    const emailPromises = [];
    events.forEach((event) => {
      switch (event) {
        case 'halfOfMinGoalReached':
          emailHtmls[
            'halfOfMinGoalReached'
          ] = campaignHalfMinimumGoalReachedTemplate
            .replace('{@ISSUERNAME}', campaign.issuer.issuerName)
            .replace('{@CAMPAIGNNAME}', campaign.Name())
            .replace('{@ISSUER_EMAIL}', campaign.issuer.email);

          emailPromises.push(
            SendHtmlEmail(
              emailConfig.HONEYCOMB_EMAIL,
              'Campaign Half of Minimum Goal Reached',
              emailHtmls['halfOfMinGoalReached'],
            ),
          );
          break;
        case 'minGoalReached':
          emailHtmls['minGoalReached'] = campaignMinimumGoalReachedTemplate
            .replace('{@ISSUERNAME}', campaign.issuer.issuerName)
            .replace('{@CAMPAIGNNAME}', campaign.Name())
            .replace('{@ISSUER_EMAIL}', campaign.issuer.email);

          emailPromises.push(
            SendHtmlEmail(
              emailConfig.HONEYCOMB_EMAIL,
              'Campaign Minimum Goal Reached',
              emailHtmls['minGoalReached'],
            ),
          );
          break;
        case 'maxGoalReached':
          emailHtmls['maxGoalReached'] = campaignGoalReachedTemplate
            .replace('{@ISSUERNAME}', campaign.issuer.issuerName)
            .replace('{@CAMPAIGN_NAME}', campaign.Name())
            .replace('{@ISSUER_EMAIL}', campaign.issuer.email);
          emailPromises.push(
            SendHtmlEmail(
              emailConfig.HONEYCOMB_EMAIL,
              'Campaign Maximum Goal Reached',
              emailHtmls['maxGoalReached'],
            ),
          );
          break;
      }
    });
    if (data.configuration.isSendFINRAEmails) {
      await Promise.all(emailPromises);
    }
    return true;
  };

  async sendInvestmentReceipt({
    user,
    campaign,
    campaignName1,
    campaignName2,
    fee,
    feePercentage,
    fee2,
    feePercentage2,
    amountToCharge,
    amount1,
    amount2,
    subTotal,
    transactionType,
    bank,
    card,
    link,
    subject,
    liveCampaignLink,
    canAddPromotionCredit,
  }) {
    let InvestmentReceiptEmail;
    let interest_rate = '';
    if (campaign.investmentType !== 'Equity' && campaign.annualInterestRate) {
      interest_rate = `The interest rate for your investment is ${campaign.annualInterestRate}%`;
    }
    if (
      transactionType === TransactionType.CreditCard().getValue() ||
      transactionType === TransactionType.ACH().getValue() ||
      transactionType === TransactionType.Wallet().getValue() ||
      transactionType === TransactionType.GooglePay().getValue() ||
      transactionType === TransactionType.ApplePay().getValue()
    ) {
      let paymentMethod = '';
      let amount = '$0.00';
      if (transactionType === TransactionType.CreditCard().getValue()) {
        transactionType = 'Credit Card';
        paymentMethod = `(**${card})`;
        amount = dollarFormatter.format(amount1);
      }
      if (transactionType === TransactionType.ACH().getValue()) {
        transactionType = 'Bank Account';
        paymentMethod = `(**${bank})`;
        amount = dollarFormatter.format(amount1);
      }
      if (transactionType === TransactionType.Wallet().getValue()) {
        transactionType = 'Honeycomb Wallet';
        paymentMethod = '';
        amount = dollarFormatter.format(amount2);
      }
      if (transactionType === TransactionType.GooglePay().getValue()) {
        transactionType = 'Google Pay';
        paymentMethod = '';
        amount = dollarFormatter.format(amount1);
      }

      if (transactionType === TransactionType.ApplePay().getValue()) {
        transactionType = 'Apple Pay';
        paymentMethod = '';
        amount = dollarFormatter.format(amount1);
      }

      if (canAddPromotionCredit) {
        InvestmentReceiptEmail = promoCommitmentReceiptTemplate
          .replace('{@FIRST_NAME}', user.firstName)
          .replace('{@INVESTED_CAMPAIGN_NAME}', campaignName1)
          .replace('{@FULL_NAME}', user.firstName)
          .replace('{@EMAIL}', user.email)
          .replace('{@CAMPAIGN_NAME_1}', campaignName1)
          .replace('{@TRANSACTION_TYPE_1}', transactionType)
          .replace('{@AMOUNT1}', amount)
          .replace('{@FEE_PERCENTAGE_1}', this.financial(feePercentage))
          .replace('{@FEE_1}', dollarFormatter.format(fee))
          .replace('{@ACCOUNT}', paymentMethod)
          .replace('{@LINK}', link)
          .replace('{@TOTAL}', amountToCharge)
          .replace('{@SUBTOTAL}', dollarFormatter.format(subTotal))
          .replace('{@DATE}', TimeUtil.formatDate(TimeUtil.now(), 'LL-dd-yyyy'))
          .replace(
            '{@TWO_DAYS_BEFORE_CAMPAIGN_CLOSE_DATE}',
            TimeUtil.parse(new Date(campaign.getCampaignExpirationDate()).toISOString())
              .minus({ days: 2 })
              .toFormat('LL-dd-yyyy'),
          )
          .replace('{@INTEREST_RATE}', interest_rate)
          .replace('{@LIVE_LINK}', liveCampaignLink);
      } else {
        InvestmentReceiptEmail = commitmentReceiptTemplate
          .replace('{@FIRST_NAME}', user.firstName)
          .replace('{@INVESTED_CAMPAIGN_NAME}', campaignName1)
          .replace('{@FULL_NAME}', user.firstName)
          .replace('{@EMAIL}', user.email)
          .replace('{@CAMPAIGN_NAME_1}', campaignName1)
          .replace('{@TRANSACTION_TYPE_1}', transactionType)
          .replace('{@AMOUNT1}', amount)
          .replace('{@FEE_PERCENTAGE_1}', this.financial(feePercentage))
          .replace('{@FEE_1}', dollarFormatter.format(fee))
          .replace('{@ACCOUNT}', paymentMethod)
          .replace('{@LINK}', link)
          .replace('{@TOTAL}', amountToCharge)
          .replace('{@SUBTOTAL}', dollarFormatter.format(subTotal))
          .replace('{@DATE}', TimeUtil.formatDate(TimeUtil.now(), 'LL-dd-yyyy'))
          .replace(
            '{@TWO_DAYS_BEFORE_CAMPAIGN_CLOSE_DATE}',
            TimeUtil.parse(new Date(campaign.getCampaignExpirationDate()).toISOString())
              .minus({ days: 2 })
              .toFormat('LL-dd-yyyy'),
          )
          .replace('{@INTEREST_RATE}', interest_rate)
          .replace('{@LIVE_LINK}', liveCampaignLink);
      }
    } else {
      transactionType = 'Bank Account';
      if (canAddPromotionCredit) {
        InvestmentReceiptEmail = promoHybridCommitmentReceiptTemplate
          .replace('{@FIRST_NAME}', user.firstName)
          .replace('{@INVESTED_CAMPAIGN_NAME}', campaignName1)
          .replace('{@FULL_NAME}', user.firstName)
          .replace('{@EMAIL}', user.email)
          .replace('{@CAMPAIGN_NAME_1}', campaignName1)
          .replace('{@TRANSACTION_TYPE_1}', transactionType)
          .replace('{@AMOUNT1}', dollarFormatter.format(amount1))
          .replace('{@FEE_PERCENTAGE_1}', this.financial(feePercentage))
          .replace('{@FEE_1}', dollarFormatter.format(fee))
          .replace('{@CAMPAIGN_NAME_2}', campaignName2)
          .replace('{@AMOUNT2}', dollarFormatter.format(amount2))
          .replace('{@FEE_2}', dollarFormatter.format(fee2))
          .replace('{@FEE_PERCENTAGE_2}', this.financial(feePercentage2))
          .replace('{@SUBTOTAL}', dollarFormatter.format(subTotal))
          .replace('{@ACCOUNT}', `(**${bank})`)
          .replace('{@TOTAL}', amountToCharge)
          .replace('{@LINK}', link)
          .replace('{@DATE}', TimeUtil.formatDate(TimeUtil.now(), 'LL-dd-yyyy'))
          .replace(
            '{@TWO_DAYS_BEFORE_CAMPAIGN_CLOSE_DATE}',
            TimeUtil.parse(new Date(campaign.getCampaignExpirationDate()).toISOString())
              .minus({ days: 2 })
              .toFormat('LL-dd-yyyy'),
          )
          .replace('{@INTEREST_RATE}', interest_rate)
          .replace('{@LIVE_LINK}', liveCampaignLink);
      } else {
        InvestmentReceiptEmail = hybridCommitmentReceiptTemplate
          .replace('{@FIRST_NAME}', user.firstName)
          .replace('{@INVESTED_CAMPAIGN_NAME}', campaignName1)
          .replace('{@FULL_NAME}', user.firstName)
          .replace('{@EMAIL}', user.email)
          .replace('{@CAMPAIGN_NAME_1}', campaignName1)
          .replace('{@TRANSACTION_TYPE_1}', transactionType)
          .replace('{@AMOUNT1}', dollarFormatter.format(amount1))
          .replace('{@FEE_PERCENTAGE_1}', this.financial(feePercentage))
          .replace('{@FEE_1}', dollarFormatter.format(fee))
          .replace('{@CAMPAIGN_NAME_2}', campaignName2)
          .replace('{@AMOUNT2}', dollarFormatter.format(amount2))
          .replace('{@FEE_2}', dollarFormatter.format(fee2))
          .replace('{@FEE_PERCENTAGE_2}', this.financial(feePercentage2))
          .replace('{@SUBTOTAL}', dollarFormatter.format(subTotal))
          .replace('{@ACCOUNT}', `(**${bank})`)
          .replace('{@TOTAL}', amountToCharge)
          .replace('{@LINK}', link)
          .replace('{@DATE}', TimeUtil.formatDate(TimeUtil.now(), 'LL-dd-yyyy'))
          .replace(
            '{@TWO_DAYS_BEFORE_CAMPAIGN_CLOSE_DATE}',
            TimeUtil.parse(new Date(campaign.getCampaignExpirationDate()).toISOString())
              .minus({ days: 2 })
              .toFormat('LL-dd-yyyy'),
          )
          .replace('{@INTEREST_RATE}', interest_rate)
          .replace('{@LIVE_LINK}', liveCampaignLink);
      }
    }

    const result = await SendHtmlEmail(
      user.email,
      subject,
      InvestmentReceiptEmail,
      null,
      false,
      null,
      null,
      emailConfig.HONEYCOMB_HELLO_EMAIL,
    );
  }

  async sendIssuerInvestmentReceipt({ issuer, user, campaignFund, totalInvestments }) {
    const owner = issuer.owners.find((item) => item.primaryOwner === true);
    const ownerName = owner && owner.title ? owner.title : '';
    const investorName = `${user.firstName} ${user.lastName}`;
    const IssuerInvestmentReceiptEmail = newIssuerInvestmentTemplate
      .replace('{@BUSINESS_OWNER_NAME}', ownerName)
      .replace('{@ISSUER_NAME}', issuer.issuerName)
      .replace('{@INVESTOR_NAME}', investorName)
      .replace('{@INVESTMENT_NAME}', dollarFormatter.format(campaignFund.Amount()))
      .replace('{@ISSUER_NAME}', issuer.issuerName)
      .replace('{@TOTAL_INVESTMENTS}', dollarFormatter.format(totalInvestments));

    await SendHtmlEmail(
      issuer.email,
      `Your Campaign is Buzzing! ${emoji.get('bee')}`,
      IssuerInvestmentReceiptEmail,
    );
  }

  async sendEmailsToInvestors({
    dto,
    user,
    campaign,
    fee,
    feePercentage,
    transactionAmount,
    walletAmount,
    fixedFee,
  }) {
    let total = 0;
    let amount1 = 0;
    let amount2 = 0;
    let subTotal = 0;
    let bank;
    let card;
    const investorBank = await this.investorPaymentOptionsRepository.fetchInvestorBank(
      dto.investorId,
    );
    if (investorBank) {
      bank = investorBank.getBank().getLastFour();
    }
    let isStripeCard = campaign.escrowType === CampaignEscrow.NC_BANK ? false : true;
    const investorCard = await this.investorPaymentOptionsRepository.fetchInvestorCard(
      dto.investorId,
      isStripeCard,
    );
    if (investorCard) {
      card = investorCard.getCard().getLastFour();
    }

    const campaignMedia = await this.campaignMediaRepository.fetchAllByCampaignId(
      dto.campaignId,
    );
    let filteredMedia = null;
    filteredMedia = campaignMedia.filter((item) => item.mimeType !== 'video/youtube');
    const fileName = filteredMedia.length ? filteredMedia[0].path : campaignMedia[0].path;
    const link = `${google.GOOGLE_STORAGE_PATH}${google.BUCKET_NAME}/${fileName}`;
    const liveCampaignLink = server.IS_PRODUCTION
      ? 'https://invest.honeycombcredit.com'
      : 'https://application.honeycombcredit.com';

    if (
      dto.TransactionType() === TransactionType.ACH().getValue() ||
      dto.TransactionType() === TransactionType.CreditCard().getValue() ||
      dto.TransactionType() === TransactionType.GooglePay().getValue() ||
      dto.TransactionType() === TransactionType.ApplePay().getValue()
    ) {
      transactionAmount = transactionAmount;
      amount1 = transactionAmount;
      subTotal = dto.canAvailPromotionCredits()
        ? Number(transactionAmount) + 5
        : Number(transactionAmount);
      total = subTotal + parseFloat(fee) + parseFloat(fixedFee);
    }
    if (dto.TransactionType() === TransactionType.Hybrid().getValue()) {
      transactionAmount = transactionAmount;
      amount1 = transactionAmount;
      amount2 = walletAmount;
      subTotal = dto.canAvailPromotionCredits()
        ? Number(transactionAmount) + Number(walletAmount) + 5
        : Number(transactionAmount) + Number(walletAmount);
      total = subTotal + parseFloat(fee);
    }

    if (dto.TransactionType() === TransactionType.Wallet().getValue()) {
      walletAmount = walletAmount;
      amount1 = 0;
      amount2 = walletAmount;
      subTotal = dto.canAvailPromotionCredits()
        ? Number(walletAmount) + 5
        : Number(walletAmount);
      total = subTotal;
    }
    if (dto.EntityId()) {
      const issuerObj = await this.issuerRepository.fetchById(dto.EntityId());
      const entity = {
        issuerName: issuerObj.issuerName,
        email: issuerObj.getEmail(),
      };
      user.firstName = `${user.firstName} ${user.lastName} for ${entity.issuerName}`;
      await this.sendInvestmentReceipt({
        user,
        campaign,
        campaignName1: campaign.Name(),
        campaignName2: campaign.Name(),
        fee,
        feePercentage,
        fee2: 0,
        feePercentage2: 0,
        amountToCharge: dollarFormatter.format(total),
        amount1,
        amount2,
        subTotal,
        transactionType: dto.TransactionType(),
        bank,
        card,
        link,
        subject: 'Intermediary Investment Receipt',
        liveCampaignLink,
        canAddPromotionCredit: dto.canAvailPromotionCredits(),
      });
    } else {
      user.firstName = `${user.firstName} ${user.lastName}`;
      await this.sendInvestmentReceipt({
        user,
        campaign,
        campaignName1: campaign.Name(),
        campaignName2: campaign.Name(),
        fee,
        feePercentage,
        fee2: 0,
        feePercentage2: 0,
        amountToCharge: dollarFormatter.format(total),
        amount1,
        amount2,
        subTotal,
        transactionType: dto.TransactionType(),
        bank,
        card,
        link,
        subject: 'Investment Receipt',
        liveCampaignLink,
        canAddPromotionCredit: dto.canAvailPromotionCredits(),
      });
    }
  }
}

export default CampaignEvents;
