import User from '../../../Domain/Core/User/User';
import Owner from '../../../Domain/Core/Owner/Owner';
import Investor from '../../../Domain/Core/Investor/Investor';
import ProfilePic from '../../../Domain/Core/ProfilePic/ProfilePic';
import { RequestOrigin } from '../../../Domain/Core/ValueObjects/RequestOrigin';

type createUserDTOType = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  userName: string;
  address: string;
  apartment: string;
  city: string;
  state: string;
  zipCode: string;
  dob: Date;
  phoneNumber: string;
  facebook: string;
  linkedIn: string;
  twitter: string;
  instagram: string;
  website: string;
  investor: any;
  owner: any;
  ssn: string;
  prefix: number;
  ip: string;
  requestOrigin: string;
  isOauthSignup: boolean;
  shouldVerifySsn: boolean;
  isSsnVerified: boolean;
  country: string | null;
  isIntermediary: boolean;
  issuerId: string | null;
  intermediaryName: string | null;
  operatorAgreementApproved: boolean;
  signUpType: string;
};
class CreateUserDTO {
  private readonly user: User;
  private readonly ip: string;
  private readonly requestOrigin: string;
  private readonly isOauthSignup: boolean;
  private readonly issuerId: string;
  private readonly operatorAgreementApproved: boolean;
  private readonly intermediaryName: string | null;
  constructor({
    firstName,
    lastName,
    email,
    password,
    userName,
    address,
    apartment,
    city,
    state,
    zipCode,
    dob,
    phoneNumber,
    facebook,
    linkedIn,
    twitter,
    instagram,
    website,
    investor,
    owner,
    ssn,
    prefix,
    ip = '',
    requestOrigin,
    isOauthSignup = false,
    shouldVerifySsn,
    isSsnVerified,
    country,
    isIntermediary,
    issuerId,
    intermediaryName,
    operatorAgreementApproved,
    signUpType,
  }: Partial<createUserDTOType>) {
    this.user = User.createFromDetail(
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
      '',
      null,
      '',
      null,
      shouldVerifySsn,
      isSsnVerified,
      country,
      isIntermediary,
      false,
      false,
      false,
      null,
      null,
      null,
      null,
      null,
      signUpType,
    );
    this.user.setPassword(password);
    this.user.setProfileInfo(facebook, linkedIn, instagram, twitter);
    this.ip = ip;
    this.requestOrigin = requestOrigin;
    this.isOauthSignup = isOauthSignup;
    this.issuerId = issuerId;
    this.operatorAgreementApproved = operatorAgreementApproved;
    this.intermediaryName = intermediaryName;

    investor = typeof investor === 'string' ? JSON.parse(investor) : investor;
    if (investor && investor.annualIncome != null) {
      this.setInvestor(
        investor.annualIncome,
        investor.netWorth,
        investor.incomeVerificationTriggered,
        investor.investingAvailable,
        investor.isAccredited,
        investor.investmentCap,
        investor.userProvidedCurrentInvestments,
        investor.incomeNetWorthSignedOn,
      );
    } else {
      this.setInvestor();
    }

    if (owner) {
      owner = typeof owner === 'string' ? JSON.parse(owner) : owner;
      const {
        title,
        subTitle,
        description,
        primaryOwner,
        beneficialOwner,
        businessOwner,
      } = owner;
      this.setOwner(
        title,
        subTitle,
        description,
        primaryOwner,
        beneficialOwner,
        businessOwner,
      );
    }
  }

  /**
   * @return {User}
   */
  getUser() {
    return this.user;
  }

  getIP() {
    return this.ip;
  }

  /**
   * @return {string}
   */
  getEmail() {
    return this.user.email;
  }

  /**
   * @return {string}
   */
  getUserId() {
    return this.user.userId;
  }

  /**
   * @return {string}
   */
  getPassword() {
    return this.user.password;
  }

  /**
   * @return {string}
   */
  getFirstName() {
    return this.user.firstName;
  }

  /**
   * @return {string}
   */
  getLastName() {
    return this.user.lastName;
  }

  /**
   * @return {string}
   */
  getSSN() {
    return this.user.ssn;
  }
  /**
   *
   * @param password
   */
  setPassword(password) {
    this.user.setPassword(password);
  }

  /**
   *
   * @returns {boolean}
   */
  getIntermediary() {
    return this.user.getIntermediary();
  }

  /**
   *
   * @returns {string} issuerId
   */
  getIssuerId(): string {
    return this.issuerId;
  }

  /**
   * @return {boolean}
   *
   */
  getOperatorAgreementApproved(): boolean {
    return this.operatorAgreementApproved;
  }

  getIntermediaryName() {
    return this.intermediaryName;
  }

  setOwner(title, subTitle, description, primaryOwner, beneficialOwner, businessOwner) {
    const owner = Owner.createFromDetail(
      this.user.userId,
      title,
      subTitle,
      description,
      primaryOwner,
      beneficialOwner,
      businessOwner,
    );
    this.user.setOwner(owner);
  }

  setProfilePic(profilePicObj) {
    const { filename: name, path, mimetype: mimeType, originalPath } = profilePicObj;
    const profilePic = ProfilePic.createFromDetail(
      name,
      path,
      mimeType,
      this.user.userId,
      originalPath,
    );
    this.user.setProfilePic(profilePic);
  }

  setInvestor(
    annualIncome?: number,
    netWorth?: number,
    incomeVerificationTriggered?: boolean,
    investingAvailable?: number,
    isAccredited?: any,
    investmentCap?: number,
    userProvidedCurrentInvestments?: string,
    incomeNetWorthSignedOn?: Date,
  ) {
    const investor = Investor.createFromDetail(
      this.user.userId,
      annualIncome,
      netWorth,
      incomeVerificationTriggered,
      investingAvailable,
      isAccredited,
      investmentCap,
      incomeNetWorthSignedOn,
    );

    if (userProvidedCurrentInvestments) {
      investor.setUserProvidedCurrentInvestments(userProvidedCurrentInvestments);
      investor.setUserProvidedCurrentInvestmentsDate(new Date());
    }

    this.user.setInvestor(investor);
  }

  isAdminRequest() {
    return this.requestOrigin === RequestOrigin.ADMIN_PANEL;
  }

  isEmailVerificationRequired() {
    return !this.isOauthSignup;
  }
}

export default CreateUserDTO;
