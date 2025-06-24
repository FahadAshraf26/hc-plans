import CampaignTag from '../../Domain/Core/CampaignTag/CampaignTag';

class CreateCampaignTag {
  private campaignTag: CampaignTag;
  private campaignId!: string;

  constructor(tagIds, campaignId: string) {
    this.campaignTag = tagIds.map((tagId) => {
      return CampaignTag.createFromDetail(campaignId, tagId);
    });
    this.setCampaignId(campaignId);
  }

  setCampaignId(campaignId: string) {
    this.campaignId = campaignId;
  }

  getCampaignId(): string {
    return this.campaignId;
  }

  getCampaignTag(): CampaignTag {
    return this.campaignTag;
  }
}

export default CreateCampaignTag;
