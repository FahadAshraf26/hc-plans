import CampaignPrincipleForgiven from '@domain/Core/CampaignPrincipleForgiven/CampaignPrincipleForgiven';

class CreateCampaignPrincipleForgivenDTO {
  private campaignId: string;
  private investorId: string;
  private campaignPrincipleForgiven: CampaignPrincipleForgiven;

  constructor(campaignId: string, investorId: string, principleForgivenAmount: number) {
    this.campaignPrincipleForgiven = CampaignPrincipleForgiven.createFromDetail({
      principleForgivenAmount,
    });
    this.campaignId = campaignId;
    this.investorId = investorId;
  }

  getCampaignId() {
    return this.campaignId;
  }

  getInvestorId() {
    return this.investorId;
  }

  getCampaignPrincipleForgiven() {
    return this.campaignPrincipleForgiven;
  }
}

export default CreateCampaignPrincipleForgivenDTO;
