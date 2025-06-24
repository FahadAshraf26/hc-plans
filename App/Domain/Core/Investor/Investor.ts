import uuid from 'uuid/v4';
import User from '../User/User';
import { InvestmentLimit } from '../ValueObjects/InvestmentLimit';
import moment from 'moment';
import { InvestorAccreditationSubmission } from '../ValueObjects/InvestorAccreditationSubmission';
import { InvestorAccreditationStatus } from '../ValueObjects/InvestorAccreditationStatus';
import PaymentOptionsMap from '../../InvestorPaymentOptions/Mappers/PaymentOptionsMap';
import InvestorPaymentOptions from '../../InvestorPaymentOptions/InvestorPaymentOptions';

class Investor {
  private investorId: string;
  userId: string;
  private annualIncome: number;
  private netWorth: number;
  private incomeVerificationTriggered: boolean;
  private investingAvailable: boolean;
  private isAccredited: boolean;
  private investmentCap: string;
  private accreditedInvestorSubmission: string;
  investorBanks: any;
  dwollaCustomerId: string;
  ncAccountId: string;
  dwollaVerificationStatus: string;
  accreditedInvestorSubmissionDate: Date;
  createdAt: Date;
  userProvidedCurrentInvestments: number;
  userProvidedCurrentInvestmentsDate: Date;
  updatedAt: Date;
  deletedAt: Date;
  investReadyUserHash: string;
  investReadyToken: string;
  investReadyRefreshToken: string;
  accreditationExpiryDate: Date;
  user: User;
  userLikedCampaigns: string;
  investments: number;
  incomeNetWorthSignedOn: Date;
  vcCustomerKey: string = null;
  vcThreadBankCustomerKey: string = null;

  constructor(
    investorId,
    userId,
    annualIncome,
    netWorth,
    incomeVerificationTriggered,
    investingAvailable,
    isAccredited,
    investmentCap,
    incomeNetWorthSignedOn,
    vcCustomerKey,
    vcThreadBankCustomerKey,
  ) {
    this.investorId = investorId;
    this.userId = userId;
    this.annualIncome = annualIncome;
    this.netWorth = netWorth;
    this.incomeVerificationTriggered = incomeVerificationTriggered;
    this.investingAvailable = investingAvailable;
    this.isAccredited = isAccredited;
    this.investmentCap = investmentCap;
    this.accreditedInvestorSubmission = InvestorAccreditationSubmission.NOT_SUBMITTED;
    this.investorBanks = [];
    this.incomeNetWorthSignedOn = incomeNetWorthSignedOn;
    this.vcCustomerKey = vcCustomerKey;
    this.vcThreadBankCustomerKey = vcThreadBankCustomerKey;
  }

  setDwollaCustomer(dwollaCustomerId) {
    this.dwollaCustomerId = dwollaCustomerId;
  }

  setNorthCapitalAccountId(accountId) {
    this.ncAccountId = accountId;
  }

  setDwollaVerificationStatus(dwollaVerificationStatus) {
    this.dwollaVerificationStatus = dwollaVerificationStatus;
  }

  setAccreditedInvestorSubmission(
    accreditedInvestorSubmission,
    accreditedInvestorSubmissionDate,
  ) {
    this.accreditedInvestorSubmission = accreditedInvestorSubmission;
    this.accreditedInvestorSubmissionDate = accreditedInvestorSubmissionDate;
  }

  /**
   * Set Created Date
   * @param {Date} createdAt
   */
  setCreatedAt(createdAt) {
    this.createdAt = createdAt;
  }

  setUserProvidedCurrentInvestments(currentInvestedAmount) {
    this.userProvidedCurrentInvestments = currentInvestedAmount;
  }

  setUserProvidedCurrentInvestmentsDate(userProvidedCurrentInvestmentsDate) {
    this.userProvidedCurrentInvestmentsDate = userProvidedCurrentInvestmentsDate;
  }

  setInvestmentCap(investmentCap) {
    this.investmentCap = investmentCap;
  }

  getInvestmentCap() {
    return this.investmentCap;
  }

  getInvestorId() {
    return this.investorId;
  }

  /**
   * Set Updated Date
   * @param {Date} updatedAt
   */
  setUpdatedAt(updatedAt) {
    this.updatedAt = updatedAt;
  }

  /**
   * Set Deleted Date
   * @param {Date} deletedAt
   */
  setDeletedAT(deletedAt) {
    this.deletedAt = deletedAt;
  }

  setInvestReadyInfo(investReadyUserHash, investReadyToken, investReadyRefreshToken) {
    this.investReadyUserHash = investReadyUserHash;
    this.investReadyToken = investReadyToken;
    this.investReadyRefreshToken = investReadyRefreshToken;
  }

  setAccreditationExpiryDate(accreditationExpiryDate) {
    this.accreditationExpiryDate = accreditationExpiryDate;
  }

  setIsAccredited(isAccredited) {
    this.isAccredited = isAccredited;
  }

  setUser(user) {
    this.user = user;
  }

  setLikedCampaigns(userLikedCampaigns) {
    this.userLikedCampaigns = userLikedCampaigns;
  }

  setInvestments(investedAmount) {
    this.investments = investedAmount;
  }

  setInvestorBank(investorBank) {
    if (investorBank instanceof InvestorPaymentOptions) {
      this.investorBanks.push(investorBank);
    } else {
      this.investorBanks.push(PaymentOptionsMap.toDomain(investorBank));
    }
  }

  calculateTotalInvestmentLimit(){
    const {
      annualIncome,
      netWorth,
    } = this;

    if (annualIncome <= 0 && netWorth <= 0) {
      return InvestmentLimit.DEFAULT_INVESTMENT_LIMIT;
    }

    let investmentCap = 0;
    if (
      annualIncome < InvestmentLimit.MAX_INVESTMENT ||
      netWorth < InvestmentLimit.MAX_INVESTMENT
    ) {
      investmentCap = InvestmentLimit.DEFAULT_INVESTMENT_LIMIT;
      const lesserOfTwo =
        0.05 * annualIncome > 0.05 * netWorth ? 0.05 * annualIncome : 0.05 * netWorth;

      investmentCap =
        InvestmentLimit.DEFAULT_INVESTMENT_LIMIT > lesserOfTwo
          ? InvestmentLimit.DEFAULT_INVESTMENT_LIMIT
          : lesserOfTwo > InvestmentLimit.MAX_INVESTMENT
          ? InvestmentLimit.MAX_INVESTMENT
          : lesserOfTwo;
    }

    if (
      annualIncome > InvestmentLimit.MAX_INVESTMENT &&
      netWorth > InvestmentLimit.MAX_INVESTMENT
    ) {
      investmentCap =
        0.1 * annualIncome > 0.1 * netWorth ? 0.1 * annualIncome : 0.1 * netWorth;

      investmentCap =
        investmentCap < InvestmentLimit.MAX_INVESTMENT
          ? investmentCap
          : InvestmentLimit.MAX_INVESTMENT;
    }
    
    return investmentCap > 0 ? investmentCap : 0;
  }

  calculateInvestmentCap() {
    const {
      annualIncome,
      netWorth,
      userProvidedCurrentInvestments,
      userProvidedCurrentInvestmentsDate,
    } = this;

    const currentInvestments =
      userProvidedCurrentInvestments &&
      moment().diff(userProvidedCurrentInvestmentsDate, 'years', true) <= 1 // in the last 12 months
        ? userProvidedCurrentInvestments
        : 0;

    if (annualIncome <= 0 && netWorth <= 0) {
      return InvestmentLimit.DEFAULT_INVESTMENT_LIMIT;
    }

    let investmentCap = 0;
    if (
      annualIncome < InvestmentLimit.MAX_INVESTMENT ||
      netWorth < InvestmentLimit.MAX_INVESTMENT
    ) {
      investmentCap = InvestmentLimit.DEFAULT_INVESTMENT_LIMIT;
      const lesserOfTwo =
        0.05 * annualIncome > 0.05 * netWorth ? 0.05 * annualIncome : 0.05 * netWorth;

      investmentCap =
        InvestmentLimit.DEFAULT_INVESTMENT_LIMIT > lesserOfTwo
          ? InvestmentLimit.DEFAULT_INVESTMENT_LIMIT
          : lesserOfTwo > InvestmentLimit.MAX_INVESTMENT
          ? InvestmentLimit.MAX_INVESTMENT
          : lesserOfTwo;
    }

    if (
      annualIncome > InvestmentLimit.MAX_INVESTMENT &&
      netWorth > InvestmentLimit.MAX_INVESTMENT
    ) {
      investmentCap =
        0.1 * annualIncome > 0.1 * netWorth ? 0.1 * annualIncome : 0.1 * netWorth;

      investmentCap =
        investmentCap < InvestmentLimit.MAX_INVESTMENT
          ? investmentCap
          : InvestmentLimit.MAX_INVESTMENT;
    }

    investmentCap = investmentCap - currentInvestments;
    return investmentCap > 0 ? investmentCap : 0;
  }

  getAccreditationStatus() {
    return String(this.isAccredited) === InvestorAccreditationStatus.ACCREDITED;
  }

  /**
   * Create Investor Object
   * @param {object} investorObj
   * @returns Investor
   */
  static createFromObject(investorObj) {
    const investor = new Investor(
      investorObj.investorId,
      investorObj.userId,
      investorObj.annualIncome,
      investorObj.netWorth,
      investorObj.incomeVerificationTriggered,
      investorObj.investingAvailable,
      investorObj.isAccredited,
      investorObj.investmentCap,
      investorObj.incomeNetWorthSignedOn,
      investorObj.vcCustomerKey,
      investorObj.vcThreadBankCustomerKey
    );

    if (investorObj.investReadyUserHash) {
      investor.setInvestReadyInfo(
        investorObj.investReadyUserHash,
        investorObj.investReadyToken,
        investorObj.investReadyRefreshToken,
      );
    }

    if (investorObj.accreditedInvestorSubmission) {
      investor.setAccreditedInvestorSubmission(
        investorObj.accreditedInvestorSubmission,
        investorObj.accreditedInvestorSubmissionDate,
      );
    }

    if (investorObj.accreditationExpiryDate) {
      investor.setAccreditationExpiryDate(investorObj.accreditationExpiryDate);
    }

    if (investorObj.userProvidedCurrentInvestments) {
      investor.setUserProvidedCurrentInvestments(
        investorObj.userProvidedCurrentInvestments,
      );
    }

    if (investorObj.userProvidedCurrentInvestmentsDate) {
      investor.setUserProvidedCurrentInvestmentsDate(
        investorObj.userProvidedCurrentInvestmentsDate,
      );
    }

    if (investorObj.dwollaCustomerId) {
      investor.setDwollaCustomer(investorObj.dwollaCustomerId);
    }

    if (investorObj.ncAccountId) {
      investor.setNorthCapitalAccountId(investorObj.ncAccountId);
    }

    if (investorObj.dwollaVerificationStatus) {
      investor.setDwollaVerificationStatus(investorObj.dwollaVerificationStatus);
    }

    if (investorObj.createdAt) {
      investor.setCreatedAt(investorObj.createdAt);
    }

    if (investorObj.updatedAt) {
      investor.setUpdatedAt(investorObj.updatedAt);
    }

    if (investorObj.deletedAt) {
      investor.setDeletedAT(investorObj.deletedAt);
    }

    if (investorObj.likedCampaigns) {
      investor.setLikedCampaigns(investorObj.likedCampaigns);
    }

    if (investorObj.investments) {
      investor.setInvestments(investorObj.investments);
    }

    if (investorObj.investorBank) {
      if (Array.isArray(investorObj.investorBank)) {
        investorObj.investorBank.forEach((bankObj) => investor.setInvestorBank(bankObj));
      } else {
        investor.setInvestorBank(investorObj.investorBank);
      }
    }

    if (investorObj.user) {
      investor.setUser(investorObj.user);
    }

    return investor;
  }

  /**
   * Create Investor Object with Id
   * @param {string} userId
   * @param {number} annualIncome
   * @param {number} netWorth
   * @param {boolean} incomeVerificationTriggered
   * @param {number} investingAvailable
   * @param {string} isAccredited
   * @param {number} investmentCap
   */
  static createFromDetail(
    userId,
    annualIncome = 0,
    netWorth = 0,
    incomeVerificationTriggered = false,
    investingAvailable = 0,
    isAccredited = InvestorAccreditationStatus.NOT_ACCREDITED,
    investmentCap = 0,
    incomeNetWorthSignedOn,
    vcCustomerKey = null,
    vcThreadBankCustomerKey = null
  ) {
    return new Investor(
      uuid(),
      userId,
      annualIncome,
      netWorth,
      incomeVerificationTriggered,
      investingAvailable,
      isAccredited,
      investmentCap,
      incomeNetWorthSignedOn,
      vcCustomerKey,
      vcThreadBankCustomerKey
    );
  }
}

export default Investor;
