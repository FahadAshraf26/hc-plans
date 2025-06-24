import uuid from 'uuid/v4';
import Owner from '../Owner/Owner';
import EmployeeMap from '../Employee/EmployeeMap';
import Employee from '../Employee/Employee';
import User from '../User/User';
import IssuerBank from '../IssuerBank/IssuerBank';
import Guard from '../../../Infrastructure/Utils/Guard';
import DomainException from '../Exceptions/DomainException';
import BaseEntity from '@domain/Core/BaseEntity/BaseEntity';
import EmployeeLog from '../EmployeeLog/EmployeeLog';

class Issuer extends BaseEntity {
  issuerId: string;
  private email: string;
  issuerName: string;
  private previousName: string;
  private EIN: string;
  private businessType: string;
  private legalEntityType: string;
  private physicalAddress: string;
  private city: string;
  private state: string;
  private zipCode: string;
  private latitude: string;
  private longitude: string;
  private phoneNumber: string;
  private website: string;
  private ncIssuerId: string;
  private facebook: string;
  private linkedIn: string;
  private instagram: string;
  private twitter: string;
  private pinterest: string;
  private issuerBank: string;
  private reddit: string;
  private employeeCount: number;
  owners: any;
  employees: any;
  campaigns: [];
  campaignDetails: any;
  dwollaCustomerId: string;
  private country: string;
  dwollaBusinessClassification: string | null;
  dwollaStatus: string;
  employeeLog: EmployeeLog;

  constructor({
    issuerId,
    email,
    issuerName,
    previousName,
    EIN,
    businessType,
    legalEntityType,
    physicalAddress,
    city,
    state,
    zipCode,
    latitude,
    longitude,
    phoneNumber,
    website,
    country,
  }) {
    super();
    this.issuerId = issuerId;
    this.email = email;
    this.issuerName = issuerName;
    this.previousName = previousName;
    this.EIN = EIN;
    this.businessType = businessType;
    this.legalEntityType = legalEntityType;
    this.physicalAddress = physicalAddress;
    this.city = city;
    this.state = state;
    this.zipCode = zipCode;
    this.latitude = latitude;
    this.longitude = longitude;
    this.phoneNumber = phoneNumber;
    this.website = website;
    this.owners = [];
    this.employees = [];
    this.country = country;
  }

  setNcIssuerId(ncIssuerId: string) {
    this.ncIssuerId = ncIssuerId;
  }

  NCIssuerId() {
    return this.ncIssuerId;
  }

  IssuerName() {
    return this.issuerName;
  }

  getAddress() {
    return this.physicalAddress
  }

  getCity() {
    return this.city;
  }

  getState() {
    return this.state
  }

  getZipCode() {
    return this.zipCode;
  }

  setEmployeeLog(employeeLog) {
    this.employeeLog = employeeLog
  }

  setEmployeeCount(employeeCount) {
    this.employeeCount = employeeCount
  }

  setLatitude(latitude){
    this.latitude = latitude;
  }

  setLongitude(longitude){
    this.longitude = longitude;
  }

  /**
   *
   * @param {string} facebook
   * @param {string} linkedIn
   * @param {string} instagram
   * @param {string} twitter
   * @param {string} pinterest
   * @returns IssuerInfo
   */
  setIssuerInfo(
    facebook: string,
    linkedIn: string,
    instagram: string,
    twitter: string,
    pinterest: string,
    reddit: string,
  ) {
    this.facebook = facebook;
    this.linkedIn = linkedIn;
    this.instagram = instagram;
    this.twitter = twitter;
    this.pinterest = pinterest;
    this.reddit = reddit;
  }

  /**
   * Set Owner
   * @param {Owner} owner
   */
  setOwner(owner) {
    this.owners.push(owner);
  }

  setEmployee(employee) {
    this.employees.push(employee);
  }

  getPrimaryOwner() {
    return this.owners.find((owner) => owner.primaryOwner);
  }

  /**
   * Set IssuerBank
   * @param {IssuerBank} issuerBank
   */
  setIssuerBank(issuerBank) {
    this.issuerBank = issuerBank;
  }

  setCampaignIds(campaignIds) {
    this.campaigns = campaignIds;
  }

  setDwollaCustomerId(dwollaCustomerId: string) {
    this.dwollaCustomerId = dwollaCustomerId;
  }

  setDwollaStatus(dwollaStatus: string) {
    this.dwollaStatus = dwollaStatus;
  }

  /**
   * Remove Owner
   * @param {Owner} owner
   */
  removeOwner(owner) {
    const ownerIndex = this.owners.findIndex((item) => item.ownerId === owner.ownerId);

    if (ownerIndex > -1) {
      this.owners.splice(ownerIndex, 1);
    }
  }

  /**
   * Create Issuer Object
   * @param {object} issuerObj
   * @returns Issuer
   */
  static createFromObject(issuerObj) {
    const issuer = new Issuer(issuerObj);
    issuer.setIssuerInfo(
      issuerObj.facebook,
      issuerObj.linkedIn,
      issuerObj.instagram,
      issuerObj.twitter,
      issuerObj.pinterest,
      issuerObj.reddit,
    );

    if (issuerObj.ncIssuerId) {
      issuer.setNcIssuerId(issuerObj.ncIssuerId);
    }

    if (issuerObj.createdAt) {
      issuer.setCreatedAt(issuerObj.createdAt);
    }

    if (issuerObj.updatedAt) {
      issuer.setUpdatedAt(issuerObj.updatedAt);
    }

    if (issuerObj.deletedAt) {
      issuer.setDeletedAT(issuerObj.deletedAt);
    }

    if (issuerObj.campaigns) {
      issuer.setCampaignIds(issuerObj.campaigns);
    }

    if (Array.isArray(issuerObj.owners)) {
      issuerObj.owners.forEach((x) => {
        const owner = Owner.createFromObject(x);
        if (x.user) {
          owner.setUser(User.createFromObject(x.user));
        }
        issuer.setOwner(owner);
      });
    }

    if (Array.isArray(issuerObj.employees)) {
      issuerObj.employees.forEach((x) => {
        const employee = EmployeeMap.toDTO(Employee.create(x, x.employeeId));
        issuer.setEmployee(employee);
      });
    }

    if (typeof issuerObj.issuerBank !== 'undefined' && issuerObj.issuerBank) {
      const issuerBank = IssuerBank.createFromObject(issuerObj.issuerBank);
      issuer.setIssuerBank(issuerBank);
    }

    return issuer;
  }

  toPublicDTO() {
    return this;
  }

  getLegalEntityType() {
    return this.legalEntityType;
  }

  static createFromDetail({
    email,
    issuerName,
    previousName,
    EIN,
    businessType,
    legalEntityType,
    physicalAddress,
    city,
    state,
    zipCode,
    latitude,
    longitude,
    phoneNumber,
    website,
    facebook,
    linkedIn,
    instagram,
    twitter,
    pinterest,
    reddit,
    country,
  }) {
    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argument: email, argumentName: 'email' },
      { argument: issuerName, argumentName: 'issuerName' },
      { argument: EIN, argumentName: 'EIN' },
      { argument: businessType, argumentName: 'businessType' },
      { argument: legalEntityType, argumentName: 'legalEntityType' },
      { argument: physicalAddress, argumentName: 'physicalAddress' },
      { argument: city, argumentName: 'city' },
      { argument: state, argumentName: 'state' },
      { argument: zipCode, argumentName: 'zipCode' },
      { argument: phoneNumber, argumentName: 'phoneNumber' },
      // {argument: country, argumentName: 'country'},
    ]);

    if (!guardResult.succeeded) {
      throw new DomainException(guardResult.message);
    }

    const issuer = new Issuer({
      issuerId: uuid(),
      email,
      issuerName,
      previousName,
      EIN,
      businessType,
      legalEntityType,
      physicalAddress,
      city,
      state,
      zipCode,
      latitude,
      longitude,
      phoneNumber,
      website,
      country: country || 'United States',
    });

    issuer.setIssuerInfo(facebook, linkedIn, instagram, twitter, pinterest, reddit);

    return issuer;
  }

  setDwollaBusinessClassification(dwollaBusinessClassification: string) {
    this.dwollaBusinessClassification = dwollaBusinessClassification;
  }

  getEmail() {
    return this.email;
  }

  getPhoneNumber() {
    return this.phoneNumber;
  }
}

export default Issuer;
