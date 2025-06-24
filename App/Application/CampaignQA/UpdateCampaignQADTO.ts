import CampaignQA from '../../Domain/Core/CampaignQA/CampaignQA';

class UpdateCampaignQADTO {
  private campaignQA: CampaignQA;
  private campaignId!: string;

  constructor(campaignQAObj: CampaignQA) {
    this.campaignQA = CampaignQA.createFromObject(campaignQAObj);
  }

  getCampaignId(): string {
    return this.campaignId;
  }

  getCampaignQAId(): string {
    return this.campaignQA.campaignQAId;
  }

  getCampaignQA(): CampaignQA {
    return this.campaignQA;
  }
}

export default UpdateCampaignQADTO;
