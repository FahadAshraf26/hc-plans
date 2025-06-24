import { InvestorAccreditationStatus } from '../../Core/ValueObjects/InvestorAccreditationStatus';

class CampaignFundTypeService {
  private campaignFunds: any;

  constructor(campaignFunds) {
    this.campaignFunds = campaignFunds;
  }

  sumNonAccredited() {
    const nonAccreditedInvestments = this.campaignFunds.filter(
      (campaignFund) =>
        campaignFund.investorAccreditationStatus ===
          InvestorAccreditationStatus.NOT_ACCREDITED ||
        campaignFund.investorAccreditationStatus === InvestorAccreditationStatus.PENDING,
    );

    const sumNonAccreditedInvestments = nonAccreditedInvestments.reduce(
      (sum, campaignFund) => sum + campaignFund.amount,
      0,
    );

    return sumNonAccreditedInvestments;
  }

  sumAccredited() {
    const accreditedInvestments = this.campaignFunds.filter(
      (campaignFund) =>
        campaignFund.investorAccreditationStatus ===
        InvestorAccreditationStatus.ACCREDITED,
    );

    const sumAccredited = accreditedInvestments.reduce(
      (sum, campaignFund) => sum + campaignFund.amount,
      0,
    );

    return sumAccredited;
  }

  getTotal() {
    return this.campaignFunds.reduce((sum, campaignFund) => sum + campaignFund.amount, 0);
  }

  getCampaignFundsDetails() {
    const sumAccredited = this.sumAccredited();
    const sumNonAccredited = this.sumNonAccredited();

    return {
      sumRegCF: sumNonAccredited,
      sumRegD: sumAccredited,
      total: sumAccredited + sumNonAccredited,
    };
  }

  static createFromFunds(campaignFunds) {
    return new CampaignFundTypeService(campaignFunds);
  }
}

export default CampaignFundTypeService;
