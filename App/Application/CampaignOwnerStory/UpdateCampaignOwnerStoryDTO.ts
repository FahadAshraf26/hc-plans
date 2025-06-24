import CampaignOwnerStory from '../../Domain/Core/CampaignOwnerStory/CampaignOwnerStory';

class UpdateCampaignOwnerStoryDTO {
  private campaignOwnerStory: CampaignOwnerStory;

  constructor(campaignOwnerStoryObj) {
    this.campaignOwnerStory = CampaignOwnerStory.createFromObject(campaignOwnerStoryObj);
  }

  getCampaignId(): string {
    return this.campaignOwnerStory.campaignId;
  }

  getCampaignOwnerStoryId(): string {
    return this.campaignOwnerStory.campaignOwnerStoryId;
  }

  getCampaignOwnerStory(): CampaignOwnerStory {
    return this.campaignOwnerStory;
  }
}

export default UpdateCampaignOwnerStoryDTO;
