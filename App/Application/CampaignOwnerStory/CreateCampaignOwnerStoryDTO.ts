import CampaignOwnerStory from '../../Domain/Core/CampaignOwnerStory/CampaignOwnerStory';

class CreateCampaignOwnerStoryDTO {
  private campaignOwnerStory: CampaignOwnerStory;

  constructor(title: string, description: string, mediaUri: string, campaignId: string) {
    this.campaignOwnerStory = CampaignOwnerStory.createFromDetail(
      campaignId,
      title,
      description,
      mediaUri,
    );
  }

  getCampaignOwnerStory(): CampaignOwnerStory {
    return this.campaignOwnerStory;
  }
}

export default CreateCampaignOwnerStoryDTO;
