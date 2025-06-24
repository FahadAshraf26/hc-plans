import BaseEntity from '@domain/Core/BaseEntity/BaseEntity';
import CampaignInfo from '@domain/Core/CampaignInfo/CampaignInfo';
import CampaignPrincipleForgiven from '@domain/Core/CampaignPrincipleForgiven/CampaignPrincipleForgiven';
import Issuer from '@domain/Core/Issuer/Issuer';
import { CampaignStage } from '@domain/Core/ValueObjects/CampaignStage';
import TimeUtil from '@infrastructure/Utils/TimeUtil';
import slugify from 'slugify';
import uuid from 'uuid/v4';
import CampaignAddress from '../CampaignAddress/CampaignAddress';

class Campaign extends BaseEntity {
  campaignId?: string;
  campaignName?: string;
  issuerId?: string;
  campaignExpirationDate?: any;
  campaignStage?: string;
  campaignTargetAmount?: number;
  campaignMinimumAmount?: number;
  investmentType?: string;
  private readonly overSubscriptionAccepted?: boolean;
  private readonly typeOfSecurityOffered?: string;
  private readonly useOfProceeds?: string;
  private readonly salesLead?: string;
  private readonly summary?: string;
  private readonly demoLink?: string;
  private readonly isLocked?: boolean;
  private readonly campaignStartDate?: Date;
  private readonly campaignDuration?: any;
  private readonly earningProcess?: string;
  private readonly financialProjectionsDescription?: string;
  private readonly howHoneycombIsCompensated?: string;
  private readonly campaignDocumentUrl?: any;
  interestedInvestors?: any;
  campaignMedia?: any;
  campaignFunds?: any;
  ncOfferingId?: string;
  issuer?: any;
  campaignInfo?: any;
  campaignEscrow?: any;
  info?: any;
  isFavorite?: boolean;
  amountInvested?: number;
  investmentCount?: number;
  numInvestors?: number;
  regCFFunds?: number;
  regDFunds?: number;
  totalFundsRaised?: number;
  businessUpdatecount?: number;
  campaignQACount?: number;
  campaignLikesCount?: number;
  numRefundRequested?: number;
  businessUpdateCount?: number;
  badActorScreeningResult?: string;
  badActorInfoIdentityAtTimeOfOnboarding?: string;
  noOfInvestorWithdrawn?: number;
  applicationReviewResult?: string;
  slug: string;
  private readonly repaymentSchedule: string;
  private readonly collateral: string;
  annualInterestRate: number;
  maturityDate: Date;
  repaymentStartDate: Date;
  loanDuration: number;
  isCampaignRoughBudget?: boolean;
  isCampaignPL?: boolean;
  isCampaignMedia?: boolean;
  isChargeFee: boolean;
  interestOnlyLoanDuration: number | null;
  campaignEndTime: string | null;
  campaignTimezone: string | null;
  blanketLien: Boolean | false;
  equipmentLien: Boolean | false;
  isPersonalGuarantyFilled: Boolean | false;
  personalGuaranty: string | null;
  signImage: any | null;
  campaignPrincipleForgiven: CampaignPrincipleForgiven;
  shareValue: number | null;
  escrowType: string;
  isChargeStripe: boolean;
  isCampaignAddress: boolean;
  campaignAddress: CampaignAddress;
  competitorOffering?: string;
  isShowOnExplorePage: boolean;
  investmentConfiguration: {
    minAmount: number;
    investmentOptions: Array<number>;
    mostPopular: number;
    maxAmount: number;
  };
  dividendRate: number;
  constructor({
    campaignId,
    campaignName,
    issuerId,
    campaignExpirationDate,
    campaignStage,
    campaignTargetAmount,
    campaignMinimumAmount,
    investmentType,
    overSubscriptionAccepted,
    typeOfSecurityOffered,
    useOfProceeds,
    salesLead,
    summary,
    demoLink,
    isLocked,
    campaignStartDate,
    campaignDuration,
    earningProcess,
    financialProjectionsDescription = '',
    howHoneycombIsCompensated,
    campaignDocumentUrl = null,
    repaymentSchedule,
    collateral,
    annualInterestRate,
    maturityDate,
    repaymentStartDate,
    loanDuration,
    isChargeFee,
    interestOnlyLoanDuration,
    campaignEndTime,
    campaignTimezone,
    blanketLien,
    equipmentLien,
    isPersonalGuarantyFilled,
    personalGuaranty,
    shareValue,
    escrowType,
    isChargeStripe,
    isCampaignAddress = false,
    competitorOffering,
    isShowOnExplorePage = true,
    investmentConfiguration,
    dividendRate,
  }) {
    super();
    if (campaignName) {
      this.slug = slugify(campaignName);
    }
    this.campaignId = campaignId;
    this.campaignName = campaignName;
    this.issuerId = issuerId;
    this.campaignExpirationDate = campaignExpirationDate;
    this.campaignStage = campaignStage;
    this.campaignTargetAmount = campaignTargetAmount;
    this.campaignMinimumAmount = campaignMinimumAmount;
    this.investmentType = investmentType;
    this.overSubscriptionAccepted = overSubscriptionAccepted;
    this.typeOfSecurityOffered = typeOfSecurityOffered;
    this.useOfProceeds = useOfProceeds;
    this.salesLead = salesLead;
    this.summary = summary;
    this.demoLink = demoLink;
    this.isLocked = isLocked;
    this.campaignStartDate = campaignStartDate;
    this.campaignDuration = campaignDuration;
    this.financialProjectionsDescription = financialProjectionsDescription;
    this.howHoneycombIsCompensated = howHoneycombIsCompensated;
    this.campaignDocumentUrl = campaignDocumentUrl;
    this.earningProcess = earningProcess;
    this.interestedInvestors = [];
    this.campaignMedia = [];
    this.campaignFunds = [];
    this.repaymentSchedule = repaymentSchedule;
    this.collateral = collateral;
    this.annualInterestRate = annualInterestRate;
    this.maturityDate = maturityDate;
    this.repaymentStartDate = repaymentStartDate;
    this.loanDuration = loanDuration;
    this.isChargeFee = isChargeFee;
    this.interestOnlyLoanDuration = interestOnlyLoanDuration;
    this.campaignEndTime = campaignEndTime;
    this.campaignTimezone = campaignTimezone;
    this.blanketLien = blanketLien;
    this.equipmentLien = equipmentLien;
    this.isPersonalGuarantyFilled = isPersonalGuarantyFilled;
    this.personalGuaranty = personalGuaranty;
    this.shareValue = shareValue;
    this.escrowType = escrowType;
    this.isChargeStripe = isChargeStripe;
    this.isCampaignAddress = isCampaignAddress;
    this.competitorOffering = competitorOffering;
    this.isShowOnExplorePage = isShowOnExplorePage;
    this.investmentConfiguration = investmentConfiguration;
    this.dividendRate = dividendRate;
  }

  CampaignId() {
    return this.campaignId;
  }

  OfferingId() {
    return this.ncOfferingId;
  }

  setInfo(info) {
    this.info = info;
  }

  setIssuer(issuer) {
    this.issuer = issuer;
  }

  setSignImage(signImage) {
    this.signImage = signImage;
  }

  setCampaignPrincipleForgiven(campaignPrincipleForgiven) {
    this.campaignPrincipleForgiven = campaignPrincipleForgiven;
  }

  /**
   * Set Investor
   * @param {Investor} investor
   */
  setInterestedInvestor(investor: any) {
    const alreadyExists = this.interestedInvestors.find(
      (interestedInvestor) => interestedInvestor.investorId === investor.investorId,
    );

    if (!alreadyExists) {
      this.interestedInvestors.push(investor);
    }
  }

  /**
   * Remove Investor
   * @param {Investor} investor
   */
  removeInterestedInvestor(investor: any) {
    const investorIndex = this.interestedInvestors.findIndex(
      (interestedInvestor) => interestedInvestor.investorId === investor.investorId,
    );

    if (investorIndex > -1) {
      this.interestedInvestors.splice(investorIndex, 1);
    }
  }

  /**
   * set media for a campaign
   */
  setMedia(media) {
    const alreadyExists = this.campaignMedia.find(
      (campaignmedia) => campaignmedia.campaignMediaId === media.campaignMediaId,
    );
    if (!alreadyExists) {
      this.campaignMedia.push(media);
    }
  }

  /**
   * remove media for a campaign
   * @param {*} media
   */
  removeMedia(media) {
    const mediaIndex = this.campaignMedia.findIndex(
      (campaignmedia) => campaignmedia.campaignMediaId === media.campaignMediaId,
    );

    if (mediaIndex > -1) {
      this.campaignMedia.splice(mediaIndex, 1);
    }
  }

  /**
   *
   * @param fund
   */
  setCampaignFund(fund) {
    this.campaignFunds.push(fund);
  }

  removeCampaignFund(fund) {
    const fundIndex = this.campaignFunds.findIndex(
      (campaignFund) => campaignFund.campaignFundId === fund.campaignFundId,
    );

    if (fundIndex > -1) {
      this.campaignFunds.splice(fundIndex, 1);
    }
  }

  Name() {
    return this.campaignName;
  }

  getCampaignExpirationDate() {
    return this.campaignExpirationDate;
  }

  IsCampaignRoughBudget(campaignRoughBudget) {
    this.isCampaignRoughBudget = campaignRoughBudget;
  }

  IsCampaignPL(campaignPL) {
    this.isCampaignPL = campaignPL;
  }

  IsCampaignMedia(campaignMedia) {
    this.isCampaignMedia = campaignMedia;
  }

  isActiveCampaign() {
    // const response: any = timeLeft(
    //   this.campaignTimezone,
    //   this.campaignEndTime,
    //   moment(this.campaignExpirationDate, 'MM-DD-YYYY').add(1, 'days'),
    // );

    // if (response[0] > 0 && response[1] > 0) {
    return this.campaignStage === CampaignStage.FUNDRAISING;
    // }
  }

  setCampaignInfo(campaignInfo) {
    this.campaignInfo = campaignInfo;
  }

  getOverSubscriptionAccepted() {
    return this.overSubscriptionAccepted;
  }

  calculateExpirationDate() {
    const campaignExpirationDate = TimeUtil.parse(this.campaignStartDate).plus({
      days: this.campaignDuration,
    });
    this.campaignExpirationDate = TimeUtil.getUSDateString(
      campaignExpirationDate,
      'yyyy-LL-dd',
    );
    return campaignExpirationDate;
  }

  setEscrowBank(campaignEscrow) {
    this.campaignEscrow = campaignEscrow;
  }

  setCampaignAddress(campaignAddress) {
    this.campaignAddress = campaignAddress;
  }

  setCompetitorOffering(competitorOffering?: string) {
    this.competitorOffering = competitorOffering;
  }

  /**
   * Create Campaign Object
   * @param {object} campaignObject
   * @returns Campaign
   */
  static createFromObject(campaignObject: any): Campaign {
    const campaign = new Campaign(campaignObject);

    campaign.calculateExpirationDate();

    if (campaignObject.issuer) {
      campaign.setIssuer(Issuer.createFromObject(campaignObject.issuer));
    }

    if (campaignObject.ncOfferingId) {
      campaign.setOfferingId(campaignObject.ncOfferingId);
    }

    if (Array.isArray(campaignObject.campaignFunds)) {
      campaignObject.campaignFunds.forEach((fund) => {
        campaign.setCampaignFund(fund);
      });
    }

    if (campaignObject.campaignEscrow) {
      campaign.setEscrowBank(campaignObject.campaignEscrow);
    }

    if (campaignObject.createdAt) {
      campaign.setCreatedAt(campaignObject.createdAt);
    }

    if (campaignObject.updatedAt) {
      campaign.setUpdatedAt(campaignObject.updatedAt);
    }

    if (campaignObject.deletedAt) {
      campaign.setDeletedAT(campaignObject.deletedAt);
    }

    if (campaignObject.campaignPrincipleForgiven) {
      const campaignPrincipleForgiven = CampaignPrincipleForgiven.createFromObject(
        campaignObject.campaignPrincipleForgiven,
      );
      campaign.setCampaignPrincipleForgiven(campaignPrincipleForgiven);
    }

    if (campaignObject.campaignInfo) {
      const info = CampaignInfo.createFromObject(campaignObject.campaignInfo);
      info.financialHistory = JSON.parse(info.financialHistory);
      info.milestones = JSON.parse(info.milestones);
      campaign.setInfo(info);
    }

    if (campaignObject.isCampaignAddress && campaignObject.campaignAddress) {
      const campaignAddress = CampaignAddress.createFromObject(
        campaignObject.campaignAddress,
      );
      campaign.setCampaignAddress(campaignAddress);
    }

    if (campaignObject.competitorOffering) {
      campaign.setCompetitorOffering(campaignObject.competitorOffering);
    }

    if (!campaignObject.investmentConfiguration) {
      campaign.investmentConfiguration = {
        minAmount: 100,
        investmentOptions: [250, 1000, 5000],
        mostPopular: 5000,
        maxAmount: 100000,
      };
    }

    return campaign;
  }

  toPublicDTO() {
    const { ncOfferingId, ...rest } = this;

    return rest;
  }

  setOfferingId(offeringId) {
    this.ncOfferingId = offeringId;
  }

  /**
   * @returns {Campaign}
   */
  static createFromDetail(campaignProps): Campaign {
    const campaign = new Campaign({
      campaignId: uuid(),
      ...campaignProps,
    });
    if (!campaignProps.investmentConfiguration) {
      campaign.investmentConfiguration = {
        minAmount: 100,
        investmentOptions: [250, 1000, 5000],
        mostPopular: 5000,
        maxAmount: 100000,
      };
    }
    return campaign;
  }
}

export default Campaign;
