import IssuerBank from '@domain/Core/IssuerBank/IssuerBank';

class UpdateIssuerBankDTO {
  private readonly issuerBank: IssuerBank;
  private readonly issuerBankId: string;
  private readonly issuerId: string;
  payload: any;

  constructor(issuerBankId: string, payload: any, issuerId: string) {
    const issuerBankObject = { issuerBankId, ...payload, issuerId };
    this.issuerBank = IssuerBank.createFromObject(issuerBankObject);
    this.issuerBankId = issuerBankId;
    this.issuerId = issuerId;
  }

  getIssuerBank() {
    return this.issuerBank;
  }

  getIssuerBankId() {
    return this.issuerBankId;
  }

  getIssuerId() {
    return this.issuerId;
  }
}

export default UpdateIssuerBankDTO;