class DwollaCustomerFundingSourceDTO {
  private FIRST_NAME: string;
  private INVESTOR_BANK_ACCOUNT_NAME: string;
  private ISSUER_NAME: string;
  private ISSUER_BANK_ACCOUNT_NAME: string;

  constructor(data: any) {
    this.FIRST_NAME =
      data.investor && data.investor.user ? data.investor.user.firstName : 'First Name';
    this.INVESTOR_BANK_ACCOUNT_NAME = data.accountName
      ? data.accountName
      : 'BANK ACCOUNT NAME';
    this.ISSUER_NAME = data.issuer ? data.issuer.issuerName : 'Name';
    this.ISSUER_BANK_ACCOUNT_NAME = data.accountName
      ? data.accountName
      : 'BANK ACCOUNT NAME';
  }
}

export default DwollaCustomerFundingSourceDTO;
