import CampaignRisk from '../../Domain/Core/CampaignRisk/CampaignRisk';

class UpdateCampaignRiskDTO {
  private risk: CampaignRisk;
  constructor(campaignRiskObj) {
    this.risk = CampaignRisk.createFromObject(campaignRiskObj);
  }

  getCampaignId(): string {
    return this.risk.campaignId;
  }

  getCampaignRiskId(): string {
    return this.risk.campaignRiskId;
  }

  getCampaignRisk(): CampaignRisk {
    return this.risk;
  }
}

export default UpdateCampaignRiskDTO;
