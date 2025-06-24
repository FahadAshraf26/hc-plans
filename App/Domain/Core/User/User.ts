import HttpError from '@infrastructure/Errors/HttpException';
import uuid from 'uuid/v4';
import InvestmentLimitReachedException from '../../Exceptions/Investors/InvestmentLimitReachedException';
import NoNorthCapitalAccount from '../../Exceptions/Investors/NoNorthCapitalAccount';
import EmailNotVerifiedException from '../../Exceptions/Users/EmailNotVerifiedException';
import KYCNotVerifiedException from '../../Exceptions/Users/KYCNotVerifiedException';
import UserEmailUpdatedEvent from '../../Users/DomainEvents/UserEmailUpdatedEvent';
import UserKYCVerifiedEvent from '../../Users/DomainEvents/UserKYCVerifiedEvent';
import UserPasswordUpdatedEvent from '../../Users/DomainEvents/UserPasswordUpdatedEvent';
import BaseEntity from '../BaseEntity/BaseEntity';
import Investor from '../Investor/Investor';
import Owner from '../Owner/Owner';
import ProfilePic from '../ProfilePic/ProfilePic';
import { EmailVerificationStatus } from '../ValueObjects/EmailVerificationStatus';
import { InvestorAccreditationStatus } from '../ValueObjects/InvestorAccreditationStatus';
import { InvestorAccreditationSubmission } from '../ValueObjects/InvestorAccreditationSubmission';
import { KycStatus } from '../ValueObjects/KycStatus';

class User extends BaseEntity {
  userId: string;
  firstName: string;
  lastName: string;
  userName: string | null;
  email: string;
  password: string;
  address: string | null;
  apartment: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  dob: Date | null;
  phoneNumber: string | null;
  facebook: string;
  linkedIn: string;
  twitter: string;
  instagram: string;
  website: string | null;
  ssn: string | undefined;
  prefix: string;
  isVerified: string;
  detailSubmittedDate: Date;
  notificationToken: string;
  isEmailVerified: string;
  idVerifiedPrompt: boolean;
  portfolioVisited: boolean;
  ncPartyId: string;
  optOutOfEmail: Date | null;
  moneyMadeId: string;
  accessToken: string;
  refreshToken: string;
  lastLogin: Date;
  idologyTimestamps: Date;
  isIntermediary: boolean;
  userQuestions: any;
  businessOwner: boolean = false;
  lastPrompt: any;
  vcCustomerId: string = null;
  stripeCustomerId: string = null;
  kycProvider: string | null = null;
  investor: {
    investorId: string;
    annualIncome: number;
    netWorth: number;
    incomeVerificationTriggered: boolean;
    investingAvailable: number;
    isAccredited: string;
    investmentCap: number;
    userProvidedCurrentInvestments: number;
    userProvidedCurrentInvestmentsDate: Date;
    investReadyToken: string;
    investReadyRefreshToken: string;
    investReadyUserHash: string;
    accreditationExpiryDate: Date;
    dwollaCustomerId: string;
    accreditedInvestorSubmission: string;
    accreditedInvestorSubmissionDate: Date;
    dwollaVerificationStatus: string;
    ncAccountId: string;
    getAccreditationStatus: () => any;
    calculateInvestmentCap: () => number;
    calculateTotalInvestmentLimit: () => number;
    setIsAccredited: (arg1: string) => {};
    setAccreditedInvestorSubmission: (arg1: string, arg2: Date) => {};
    investorBanks: any;
    userLikedCampaigns: number;
    investments: number;
    setInvestmentCap: (arg: any) => {};
    setInvestReadyInfo: (userHash: string, userToken: string, refreshToken: string) => {};
    setAccreditationExpiryDate: (lastExpiry: any) => {};
    setDwollaVerificationStatus: (status: string) => {};
    setNorthCapitalAccountId: (ncAccountId: string) => {};
    incomeNetWorthSignedOn: Date | null;
    vcCustomerKey: string | null;
  };
  owner: {
    ownerId: string;
    userId: string;
    title: string;
    subTitle: string;
    description: string;
    beneficialOwner: boolean;
    primaryOwner: boolean;
    beneficialOwnerId: string;
    businessOwner: boolean;
    setIssuer: (arg: any) => {};
    issuers: any;
    setBusinessOwner: (businessOwner) => {};
  };
  entities: any;
  profilePic: {};
  userType: string;
  accreditationStatus: string;
  totalInvested: number;
  otherRegCFInvestments: number;
  userLikedCampaignsCount: number;
  userQuestionsCount: number;
  portfolio: string;
  card: any;
  bank: any;
  bankConnected: any;
  shouldVerifySsn: boolean;
  isSsnVerified: boolean;
  country: string | null;
  hasSsn: boolean;
  dwollaCustomerId: string | null;
  dwollaCustomerType: string | null;
  tos: boolean;
  optIn: boolean;
  dwollaBalanceId: string | null;
  showPrompt: boolean;
  isAccountCreated: boolean = false;
  idologyIdNumber: string;
  stripePaymentMethodId: string;
  signUpType: string;
  hasCreditCard: boolean = false;
  hasBankAccount: boolean = false;
  fcmToken: string | null;
  isBiometricEnabled: boolean;
  biometricKey: string;
  vcThreadBankCustomerId: string = null;
  isRaisegreen: boolean = false;
  availedPromotionCredits: boolean=false;
  constructor(
    userId: string,
    firstName: string,
    lastName: string,
    userName: string | null,
    email: string,
    address: string | null,
    apartment: string | null,
    city: string | null,
    state: string | null,
    zipCode: string | null,
    dob: Date | null,
    phoneNumber: string | null,
    website: string | null,
    ssn: string | null,
    prefix: string,
    isVerified: string,
    detailSubmittedDate: Date,
    isEmailVerified: string,
    optOutOfEmail: Date | null,
    shouldVerifySsn: boolean,
    isSsnVerified: boolean,
    country: string | null,
    isIntermediary: boolean = false,
    tos: boolean = false,
    optIn: boolean = false,
    businessOwner: boolean = false,
    lastPrompt: any = null,
    vcCustomerId: string = null,
    stripeCustomerId: string = null,
    idologyIdNumber: string = null,
    stripePaymentMethodId: string = null,
    signUpType: string = null,
    fcmToken: string = null,
    isBiometricEnabled: boolean,
    biometricKey: string,
    vcThreadBankCustomerId: string = null,
    isRaisegreen: boolean = false,
    kycProvider: string | null = null,
  ) {
    super();
    this.userId = userId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.userName = userName;
    this.email = email;
    this.address = address;
    this.apartment = apartment;
    this.city = city;
    this.state = state;
    this.zipCode = zipCode;
    this.dob = dob;
    this.phoneNumber = phoneNumber;
    this.website = website;
    // this.ssn = ssn ? ssn.slice(ssn.length - 4, ssn.length) : undefined;
    this.ssn = ssn ? ssn : undefined;
    this.prefix = prefix;
    this.isVerified = isVerified;
    this.detailSubmittedDate = detailSubmittedDate;
    this.isEmailVerified = isEmailVerified;
    this.optOutOfEmail = optOutOfEmail;
    this.shouldVerifySsn = shouldVerifySsn;
    this.isSsnVerified = isSsnVerified;
    this.country = country;
    this.hasSsn = !!this.ssn;
    this.isIntermediary = isIntermediary;
    this.tos = tos;
    this.optIn = optIn;
    this.businessOwner = businessOwner;
    this.lastPrompt = lastPrompt;
    this.vcCustomerId = vcCustomerId;
    this.stripeCustomerId = stripeCustomerId;
    this.idologyIdNumber = idologyIdNumber;
    this.stripePaymentMethodId = stripePaymentMethodId;
    this.signUpType = signUpType;
    this.fcmToken = fcmToken;
    this.isBiometricEnabled = isBiometricEnabled;
    this.biometricKey = biometricKey;
    this.vcThreadBankCustomerId = vcThreadBankCustomerId;
    this.isRaisegreen = isRaisegreen;
    this.kycProvider = kycProvider;
  }

  setPortfolioVisited = (portfolioVisited: boolean) => {
    this.portfolioVisited = portfolioVisited;
  };

  setIdVerifiedPrompt(idVerifiedPrompt: boolean) {
    this.idVerifiedPrompt = idVerifiedPrompt;
  }

  setNotificationToken(notificationToken: string) {
    this.notificationToken = notificationToken;
  }

  getNotificationToken(): string {
    return this.notificationToken;
  }

  setEmailVerificationStatus(isEmailVerified: string) {
    this.isEmailVerified = isEmailVerified;
  }

  updateEmail(email: string) {
    if (!email || this.email === email) {
      return;
    }

    this.email = email;
    this.isEmailVerified = EmailVerificationStatus.NOT_VERIFIED;
    this.record(
      new UserEmailUpdatedEvent({
        userId: this.userId,
        user: User.createFromObject(this),
      }),
    );
  }

  updatePassword(password: string) {
    if (!password) return;

    this.password = password;
    this.record(
      new UserPasswordUpdatedEvent({
        userId: this.userId,
        email: this.email,
        firstName: this.firstName,
      }),
    );
  }

  beforeSoftDelete() {
    this.isEmailVerified = EmailVerificationStatus.NOT_VERIFIED;
  }

  markAsDeleted() {
    this.isEmailVerified = EmailVerificationStatus.VERIFIED;
    this.deletedAt = new Date();
  }

  unsubscribeFromMailGun() {
    this.optOutOfEmail = new Date();
  }

  subscribeToMailGun() {
    this.optOutOfEmail = null;
  }

  disableIdVerifiedPrompt() {
    this.idVerifiedPrompt = false;
  }

  disablePortfolioVisitedPrompt() {
    this.portfolioVisited = false;
  }

  AccreditationStatus() {
    return this.investor.getAccreditationStatus();
  }

  setMoneyMadeId(moneyMadeId) {
    this.moneyMadeId = moneyMadeId;
  }

  setKycStatus(status) {
    if (status === KycStatus.PASS) {
      this.record(new UserKYCVerifiedEvent({ userId: this.userId }));
    }

    this.isVerified = status;
  }

  initiateAccreditation() {
    const date = new Date();

    this.investor.setIsAccredited(InvestorAccreditationStatus.PENDING);
    this.investor.setAccreditedInvestorSubmission(
      InvestorAccreditationSubmission.SUBMITTED,
      date,
    );
  }

  markAsAccreditated() {
    this.investor.setIsAccredited(InvestorAccreditationStatus.ACCREDITED);
  }
  accreditedInvestorSubmissionAndDate() {
    const date = new Date();
    this.investor.setAccreditedInvestorSubmission(
      InvestorAccreditationSubmission.SUBMITTED,
      date,
    );
  }

  NcPartyId() {
    return this.ncPartyId;
  }

  NcAccountId() {
    return this.investor.ncAccountId;
  }

  InvestorId() {
    return this.investor.investorId;
  }

  NetWorth() {
    return this.investor.netWorth;
  }

  AnnualIncome() {
    return this.investor.annualIncome;
  }

  /**
   * Set password
   * @param {string} password
   */
  setPassword(password: string) {
    this.password = password;
  }

  /**
   * Set Investor object
   * @param {Investor} investor
   */
  setInvestor(investor: any) {
    this.investor = investor;
  }

  /**
   * Set ProfilePic object
   * @param {ProfilePic} profilePic
   */
  setProfilePic(profilePic: any) {
    this.profilePic = profilePic;
  }

  /**
   * Set Owner object
   * @param {Owner} owner
   */
  setOwner(owner: any) {
    this.owner = owner;
  }

  setIsSsnVerified(isSsnVerified: boolean) {
    this.isSsnVerified = isSsnVerified;
    this.shouldVerifySsn = isSsnVerified ? false : true;
  }

  setUserQA(userQuestions: any) {
    this.userQuestions = userQuestions;
  }

  /**
   * Set Profile info
   * @param {string} facebook
   * @param {string} linkedIn
   * @param {string} instagram
   * @param {string} twitter
   */
  setProfileInfo(facebook: string, linkedIn: string, instagram: string, twitter: string) {
    this.facebook = facebook;
    this.linkedIn = linkedIn;
    this.instagram = instagram;
    this.twitter = twitter;
  }

  setIdologyTimestamps(idologyTimestamps: Date) {
    this.idologyTimestamps = idologyTimestamps;
  }

  toPublicObject() {
    const { ssn, ...rest } = this;
    return rest;
  }

  /**
   *
   * @returns {boolean}
   */
  getIntermediary() {
    return this.isIntermediary;
  }

  /**
   * Create User Object
   * @param {object} userObj
   * @returns User
   */
  static createFromObject(userObj: any) {
    const user = new User(
      userObj.userId,
      userObj.firstName,
      userObj.lastName,
      userObj.userName,
      userObj.email,
      userObj.address,
      userObj.apartment,
      userObj.city,
      userObj.state,
      userObj.zipCode,
      userObj.dob,
      userObj.phoneNumber,
      userObj.website,
      userObj.ssn,
      userObj.prefix,
      userObj.isVerified,
      userObj.detailSubmittedDate,
      userObj.isEmailVerified,
      userObj.optOutOfEmail,
      userObj.shouldVerifySsn,
      userObj.isSsnVerified,
      userObj.country,
      userObj.isIntermediary,
      userObj.tos,
      userObj.optIn,
      userObj.businessOwner,
      userObj.lastPrompt,
      userObj.vcCustomerId,
      userObj.stripeCustomerId,
      userObj.idologyIdNumber,
      userObj.stripePaymentMethodId,
      userObj.signUpType,
      userObj.fcmToken,
      userObj.isBiometricEnabled,
      userObj.biometricKey,
      userObj.vcThreadBankCustomerId,
      userObj.isRaisegreen,
      userObj.kycProvider,
    );
    user.showPrompt = userObj.showPrompt;
    user.setProfileInfo(
      userObj.facebook,
      userObj.linkedIn,
      userObj.instagram,
      userObj.twitter,
    );

    if (typeof userObj.portfolioVisited !== 'undefined') {
      user.setPortfolioVisited(userObj.portfolioVisited);
    }

    if (typeof userObj.idVerifiedPrompt !== 'undefined') {
      user.setIdVerifiedPrompt(userObj.idVerifiedPrompt);
    }

    if (userObj.ncPartyId) {
      user.setNorthCapitalPartyId(userObj.ncPartyId);
    }

    if (userObj.profilePic) {
      user.setProfilePic(ProfilePic.createFromObject(userObj.profilePic));
    }

    if (userObj.idologyTimestamps) {
      user.setIdologyTimestamps(userObj.idologyTimestamps);
    }

    if (userObj.notificationToken) {
      user.setNotificationToken(userObj.notificationToken);
    }

    if (userObj.moneyMadeId) {
      user.setMoneyMadeId(userObj.moneyMadeId);
    }

    if (userObj.owner) {
      user.setOwner(Owner.createFromObject(userObj.owner));
    }

    if (userObj.investor) {
      user.setInvestor(Investor.createFromObject(userObj.investor));
    }

    if (userObj.isEmailVerified) {
      user.setEmailVerificationStatus(userObj.isEmailVerified);
    }

    if (userObj.createdAt) {
      user.setCreatedAt(userObj.createdAt);
    }
    if (userObj.updatedAt) {
      user.setUpdatedAt(userObj.updatedAt);
    }

    if (userObj.deletedAt) {
      user.setDeletedAT(userObj.deletedAt);
    }

    if (userObj.userQuestions) {
      user.setUserQA(userObj.userQuestions);
    }

    if (userObj.ssn) {
      user.hasSsn = true;
    }

    if (
      userObj.ncPartyId &&
      (userObj.vcCustomerId || userObj.vcThreadBankCustomerId) &&
      userObj.stripeCustomerId
    ) {
      user.isAccountCreated = true;
    }

    return user;
  }

  /**
   * Check Profile Pic exist or not
   * @returns boolean
   */
  hasProfilePic() {
    return !!this.profilePic;
  }

  setHasCreditCard(hasCreditCard) {
    this.hasCreditCard = hasCreditCard;
  }

  setHasBankAccount(hasBankAccount) {
    this.hasBankAccount = hasBankAccount;
  }

  getHasCreditCard() {
    return this.hasCreditCard;
  }

  getHasBankAccount() {
    return this.hasBankAccount;
  }

  /**
   * Check Owner exist or not
   * @returns boolean
   */
  hasOwner() {
    return !!this.owner;
  }

  /**
   * Check Investor exist or not
   * @returns boolean
   */
  hasInvestor() {
    return !!this.investor;
  }

  hasEntities() {
    return !!this.isIntermediary;
  }

  isPersonalInformationSubmitted() {
    return (
      !!this.zipCode &&
      !!this.address &&
      !!this.city &&
      !!this.phoneNumber &&
      !!this.state &&
      !!this.dob
    );
  }

  setLastName(name) {
    this.lastName = name;
  }
  getFullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  isUserVerified() {
    return this.isVerified === KycStatus.PASS;
  }

  isUserEmailVerified() {
    return this.isEmailVerified === EmailVerificationStatus.VERIFIED;
  }

  isRegisteredOnNorthCapital() {
    return !!this.ncPartyId && !!this.investor.ncAccountId;
  }

  isEligibleToInvest() {
    if (!this.isUserEmailVerified) {
      return new EmailNotVerifiedException();
    }

    if (!this.isUserVerified()) {
      return new KYCNotVerifiedException();
    }

    if (!this.isRegisteredOnNorthCapital()) {
      return new NoNorthCapitalAccount();
    }

    return true;
  }

  setPhoneNumber(phoneNumber: string) {
    this.phoneNumber = phoneNumber;
  }

  setPersonalInformation(payload) {
    // if (this.isUserVerified()) {
    //   return;
    // }

    this.firstName = payload.firstName || this.firstName;
    this.lastName = payload.lastName || this.lastName;
    this.dob = payload.dob || this.dob;
    this.address = payload.address || this.address;
    this.city = payload.city || this.city;
    this.state = payload.state || this.state;
    this.zipCode = payload.zipCode || this.zipCode;
    this.ssn = payload.ssn || this.ssn;
    this.apartment = payload.apartment || this.apartment;
    this.prefix = payload.prefix || this.prefix;

    if (this.ssn) {
      // update personal information
      this.detailSubmittedDate = this.detailSubmittedDate || new Date();
    }
  }

  setSocials(payload) {
    this.setProfileInfo(
      payload.facebook || this.facebook,
      payload.linkedIn || this.linkedIn,
      payload.instagram || this.instagram,
      payload.twitter || this.twitter,
    );

    this.website = payload.website || this.website;
  }
  setIntermediary(isIntermediary) {
    this.isIntermediary = isIntermediary;
  }

  hasInvestmentLimitReached(amountToInvest, amountInvestedInLastTwelveMonths) {
    if (this.investor.isAccredited === 'Not Accredited') {
      if (
        amountToInvest + amountInvestedInLastTwelveMonths >
        this.investor.calculateInvestmentCap()
      ) {
        throw new HttpError(
          400,
          'You are not able to invest.Your max invest limit exceeded',
        );
      }
    }
    const isAmountGreaterThanInvestmentLimit =
      amountInvestedInLastTwelveMonths + amountToInvest >
      this.investor.calculateInvestmentCap();

    if (!isAmountGreaterThanInvestmentLimit) {
      return false;
    }

    if (isAmountGreaterThanInvestmentLimit && this.investor.getAccreditationStatus()) {
      return false;
    }

    return new InvestmentLimitReachedException();
  }

  FirstName() {
    return this.firstName;
  }

  LastName() {
    return this.lastName;
  }

  Email() {
    return this.email;
  }

  /**
   * returns true if an investor was accredited and his accreditation is expired
   * @returns {Boolean}
   */
  hasAccreditationExpired() {
    return (
      this.investor.isAccredited === InvestorAccreditationStatus.ACCREDITED &&
      !this.investor.getAccreditationStatus()
    );
  }

  setNorthCapitalPartyId(partyId) {
    this.ncPartyId = partyId;
  }

  setAccessToken(accessToken, refreshToken) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.lastLogin = new Date();
  }

  isLoggedIn() {
    return !!this.accessToken && !!this.refreshToken;
  }

  isRaisegreenUser() {
    return this.isRaisegreen;
  }

  userLastLogin() {
    return this.lastLogin;
  }

  setEntities(entities) {
    this.entities = entities;
  }

  setCustomerId(customerId) {
    this.dwollaCustomerId = customerId;
  }

  setCustomerType(dwollaCustomerType) {
    this.dwollaCustomerType = dwollaCustomerType;
  }

  setDwollaBalanceId(dwollaBalanceId) {
    this.dwollaBalanceId = dwollaBalanceId;
  }

  setSSN(ssn) {
    this.ssn = ssn;
  }
  /**
   *Create User Object with Id
   * @param {string} firstName
   * @param {string} lastName
   * @param {string|null} userName
   * @param {string} email
   * @param {string|null} address
   * @param apartment
   * @param city
   * @param {string|null} state
   * @param {number|null} zipCode
   * @param {Date|null} dob
   * @param {string|null} phoneNumber
   * @param {string|null} website
   * @param {string|null} ssn
   * @param {integer|0} prefix
   * @param isVerified
   * @param detailSubmittedDate
   * @param isEmailVerified
   * @param optOutOfEmail
   * @param shouldVerifySsn
   * @param isSsnVerified
   * @param country
   * @param {boolean} isIntermediary
   * @param {boolean} tos
   * @param {boolean} optIn
   * @param {string|null|boolean} lastPrompt
   * @param {string|null} vcCustomerId
   * @param {string|null} stripeCustomerId
   * @param {string|null} idologyIdNumber
   * @param {string|null} stripePaymentMethodId
   * @param {string|null} signUpType
   * @returns User
   */
  static createFromDetail(
    firstName: string,
    lastName: string,
    userName: string | null = null,
    email: string,
    address: string | null = null,
    apartment: string | null = null,
    city: string | null = null,
    state: string | null = null,
    zipCode: string | null = null,
    dob: Date | null = null,
    phoneNumber: string | null = null,
    website: string | null = null,
    ssn: string | null = null,
    prefix: any = '0',
    isVerified: string = KycStatus.NOT_SUBMITTED,
    detailSubmittedDate?: Date,
    isEmailVerified: string = EmailVerificationStatus.NOT_VERIFIED,
    optOutOfEmail?: Date,
    shouldVerifySsn?: boolean,
    isSsnVerified?: boolean,
    country?: string | null,
    isIntermediary: boolean = false,
    tos: boolean = false,
    optIn: boolean = false,
    businessOwner: boolean = false,
    lastPrompt: Date = null,
    vcCustomerId: string = null,
    stripeCustomerId: string = null,
    idologyIdNumber: string = null,
    stripePaymentMethodId: string = null,
    signUpType: string = null,
    fcmToken: string = null,
    isBiometricEnabled: boolean = null,
    biometricKey: string = null,
    vcThreadBankCustomerId: string = null,
    isRaisegreen: boolean = false,
    kycProvider: string | null = null,
  ) {
    return new User(
      uuid(),
      firstName,
      lastName,
      userName,
      email,
      address,
      apartment,
      city,
      state,
      zipCode,
      dob,
      phoneNumber,
      website,
      ssn,
      prefix,
      isVerified,
      detailSubmittedDate,
      isEmailVerified,
      optOutOfEmail,
      shouldVerifySsn,
      isSsnVerified,
      country,
      isIntermediary,
      tos,
      optIn,
      businessOwner,
      lastPrompt,
      vcCustomerId,
      stripeCustomerId,
      idologyIdNumber,
      stripePaymentMethodId,
      signUpType,
      fcmToken,
      isBiometricEnabled,
      biometricKey,
      vcThreadBankCustomerId,
      isRaisegreen,
      kycProvider,
    );
  }

  setTos(tos) {
    this.tos = tos;
  }

  setOptIn(optIn) {
    this.optIn = optIn;
  }

  setUserBusinessOwner(userBusinessOwner) {
    this.businessOwner = userBusinessOwner;
  }

  setKycProvider(provider: string | null) {
    this.kycProvider = provider;
  }
}

export default User;
