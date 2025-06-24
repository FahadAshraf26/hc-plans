import CampaignFund from '../../Domain/Core/CampaignFunds/CampaignFund';

class UpdateCampaignFundDTO {
  private readonly campaignFund: any;

  constructor(campaignFundObj) {
    this.campaignFund = CampaignFund.create(
      campaignFundObj,
      campaignFundObj.campaignFundId,
    );
  }

  getCampaignId() {
    return this.campaignFund.campaignId;
  }

  getCampaignFundId() {
    return this.campaignFund.campaignFundId;
  }

  getCampaignFund() {
    return this.campaignFund;
  }
}

export default UpdateCampaignFundDTO;
