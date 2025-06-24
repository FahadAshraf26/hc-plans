import CampaignRisk from '../../Domain/Core/CampaignRisk/CampaignRisk';

class CreateCampaignRiskDTO {
  private risk: CampaignRisk;

  constructor(campaignId: string, title: string, description: string) {
    this.risk = CampaignRisk.createFromDetail(campaignId, title, description);
  }

  getCampaignId(): string {
    return this.risk.campaignId;
  }

  getCampaignRisk(): CampaignRisk {
    return this.risk;
  }
}

export default CreateCampaignRiskDTO;
