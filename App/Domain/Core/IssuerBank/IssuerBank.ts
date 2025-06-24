import uuid from 'uuid/v4';
import BaseEntity from '@domain/Core/BaseEntity/BaseEntity';

type IssuerBankObjType = {
  issuerBankId: string;
  issuerId: string;
  accountType: string;
  accountName: string;
  lastFour: string;
  accountNumber: string;
  routingNumber: string;
  issuer: any;
  dwollaSourceId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  isForRepayment: boolean;
  accountOwner: string;
  bankToken: string;
  wireRoutingNumber: string;
};

class IssuerBank extends BaseEntity {
  private issuerBankId: string;
  private issuerId: string;
  private accountType: string;
  accountName: string;
  private lastFour: string;
  private accountNumber: string;
  private routingNumber: string;
  private issuer: any;
  dwollaSourceId: string;
  isForRepayment: boolean;
  dwollaBalanceId: string;
  accountOwner: string;
  bankToken: string;
  wireRoutingNumber: string;
  constructor(
    issuerBankId: string,
    issuerId: string,
    accountType: string,
    accountName: string,
    lastFour: string,
    isForRepayment: boolean,
    accountOwner: string,
  ) {
    super();
    this.issuerBankId = issuerBankId;
    this.issuerId = issuerId;
    this.accountType = accountType;
    this.accountName = accountName;
    this.lastFour = lastFour;
    this.isForRepayment = isForRepayment;
    this.accountOwner = accountOwner;
  }

  setBank(dwollaSourceId: string) {
    this.dwollaSourceId = dwollaSourceId;
  }

  setBankToken(bankToken) {
    this.bankToken = bankToken
  }

  setWireRoutingNumber(wireRoutingNumber) {
    this.wireRoutingNumber = wireRoutingNumber
  }

  getBankToken() {
    return this.bankToken;
  }

  getWireRoutingNumber() {
    return this.wireRoutingNumber;
  }

  setIssuer(issuer: any) {
    this.issuer = issuer;
  }

  getAccountNumber() {
    return this.accountNumber;
  }

  getRoutingNumber() {
    return this.routingNumber;
  }

  getIssuerBankId() {
    return this.issuerBankId;
  }

  getAccountType() {
    return this.accountType;
  }

  getAccountName() {
    return this.accountName;
  }

  /**
   * hide sensitive data
   */
  toPublicObject() {
    const { accountNumber, routingNumber, ...rest } = this;

    return rest;
  }

  setDwollaBalanceId(dwollaBalanceId) {
    this.dwollaBalanceId = dwollaBalanceId;
  }

  setAccountNumber(accountNumber) {
    this.accountNumber = accountNumber;
  }

  setRoutingNumber(routingNumber) {
    this.routingNumber = routingNumber;
  }

  /**
   * Create Issuer bank Object
   * @param {object} issuerBankObj
   * @returns Issuer bank
   */
  static createFromObject(issuerBankObj: IssuerBankObjType): IssuerBank {
    const issuerBank = new IssuerBank(
      issuerBankObj.issuerBankId,
      issuerBankObj.issuerId,
      issuerBankObj.accountType,
      issuerBankObj.accountName,
      issuerBankObj.lastFour,
      issuerBankObj.isForRepayment,
      issuerBankObj.accountOwner,
    );

    if (issuerBankObj.dwollaSourceId) {
      issuerBank.setBank(issuerBankObj.dwollaSourceId);
    }

    if (issuerBankObj.bankToken) {
      issuerBank.setBankToken(issuerBankObj.bankToken)
    }

    if (issuerBankObj.wireRoutingNumber) {
      issuerBank.setWireRoutingNumber(issuerBankObj.wireRoutingNumber)
    }

    // if (issuerBankObj.issuer) {
    //   issuerBank.setIssuer(Issuer.createFromObject(issuerBankObj.issuer));
    // }

    if (issuerBankObj.createdAt) {
      issuerBank.setCreatedAt(issuerBankObj.createdAt);
    }

    if (issuerBankObj.updatedAt) {
      issuerBank.setUpdatedAt(issuerBankObj.updatedAt);
    }

    if (issuerBankObj.deletedAt) {
      issuerBank.setDeletedAT(issuerBankObj.deletedAt);
    }

    return issuerBank;
  }

  /**
   * Create Issuer Bank Object with Id
   * @param {string} bankToken
   * @param {string} accountOwner - where account belongs to issuer or escrow
   */
  static createFromDetail(
    issuerId: string,
    accountType: string,
    accountName: string,
    lastFour: string,
    isForRepayment: boolean = false,
    accountOwner: string,
  ): IssuerBank {
    return new IssuerBank(
      uuid(),
      issuerId,
      accountType,
      accountName,
      lastFour,
      isForRepayment,
      accountOwner,
    );
  }
}

export default IssuerBank;
