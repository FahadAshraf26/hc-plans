import moment from 'moment';

class BankTransferCompletedRepaymentDTO {
  private FIRST_NAME: string;
  private AMOUNT: string;
  private CAMPAIGN_NAME: string;
  private INVESTOR_BANK_ACCOUNT_NAME: string;
  private ISSUER_NAME: string;
  private ISSUER_BANK_ACCOUNT_NAME: string;
  private INVESTOR_EMAIL: string;
  private ISSUER_EMAIL: string;
  private DATE: string;

  constructor(data) {
    this.FIRST_NAME = 'First Name';
    this.AMOUNT = '$0.00';
    this.INVESTOR_EMAIL = 'email@email.com';
    this.INVESTOR_BANK_ACCOUNT_NAME = 'Investor Bank Account Name';
    this.CAMPAIGN_NAME = 'Campaign Name';
    this.ISSUER_EMAIL = 'email@email.com';
    this.ISSUER_NAME = 'Issuer Name';
    this.ISSUER_BANK_ACCOUNT_NAME = 'Issuer Bank Account Name';

    if (data.campaignInvestor && data.campaignInvestor.user) {
      this.FIRST_NAME = data.campaignInvestor.user.firstName
        ? data.campaignInvestor.user.firstName
        : 'First Name';
      this.AMOUNT = data.amount ? `$${data.amount}` : '$0.00';
      this.INVESTOR_EMAIL = data.campaignInvestor.user.email
        ? data.campaignInvestor.user.email
        : 'email@email.com';
    }
    if (
      data.campaignInvestor &&
      data.campaignInvestor.user &&
      data.campaignInvestor.investorBanks &&
      data.campaignInvestor.investorBanks.length > 0
    ) {
      this.INVESTOR_BANK_ACCOUNT_NAME = data.campaignInvestor.investorBanks[0].accountName
        ? `"${data.campaignInvestor.investorBanks[0].accountName}"`
        : 'Bank Account Name';
    }
    if (data.campaign && data.campaign.issuer) {
      this.CAMPAIGN_NAME = data.campaign.campaignName
        ? data.campaign.campaignName
        : 'Campaign Name';
      this.ISSUER_EMAIL = data.campaign.issuer.email
        ? data.campaign.issuer.email
        : 'email@email.com';
      this.ISSUER_NAME = data.campaign.issuer.issuerName
        ? data.campaign.issuer.issuerName
        : 'Issuer Name';
    }
    if (data.campaign && data.campaign.issuer && data.campaign.issuer.issuerBank) {
      this.ISSUER_BANK_ACCOUNT_NAME = data.campaign.issuer.issuerBank.accountName
        ? `"${data.campaign.issuer.issuerBank.accountName}"`
        : 'Bank Account Name';
    }

    this.DATE = moment().format('MM-DD-Y');
  }
}

export default BankTransferCompletedRepaymentDTO;
