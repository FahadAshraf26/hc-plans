import CampaignQA from '../../Domain/Core/CampaignQA/CampaignQA';

class CreateCampaignQADTO {
  private campaignQA: CampaignQA;
  private campaignId!: string;

  constructor(
    campaignId: string,
    userId: string,
    parentId: string,
    type: string,
    text: string,
  ) {
    this.campaignQA = CampaignQA.createFromDetail(
      campaignId,
      userId,
      parentId,
      type,
      text,
    );
  }

  getCampaignQAId(): string {
    return this.campaignQA.campaignQAId;
  }

  getCampaignQA(): CampaignQA {
    return this.campaignQA;
  }

  getCampaignId(): string {
    return this.campaignId;
  }
}

export default CreateCampaignQADTO;
