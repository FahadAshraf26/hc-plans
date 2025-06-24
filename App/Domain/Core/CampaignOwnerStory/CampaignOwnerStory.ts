import uuid from 'uuid/v4';
import Campaign from '../Campaign/Campaign';

class CampaignOwnerStory {
  campaignOwnerStoryId: string;
  campaignId: string;
  title: string;
  description: string;
  mediaUri: string;
  isFavorite: boolean;
  campaign: Campaign;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;

  constructor(
    campaignOwnerStoryId: string,
    campaignId: string,
    title: string,
    description: string,
    mediaUri: string,
  ) {
    this.campaignOwnerStoryId = campaignOwnerStoryId;
    this.campaignId = campaignId;
    this.title = title;
    this.description = description;
    this.mediaUri = mediaUri;
    this.isFavorite = false;
  }

  setCampaign(campaign: Campaign) {
    this.campaign = campaign;
  }

  /**
   *set Created Date
   * @param {date} createdAt
   */
  setCreatedAt(createdAt: Date) {
    this.createdAt = createdAt;
  }

  /**
   *set Updated Date
   * @param {date} updatedAt
   */
  setUpdatedAt(updatedAt: Date) {
    this.updatedAt = updatedAt;
  }

  /**
   *
   * @param {date} deletedAt
   */
  setDeletedAT(deletedAt: Date) {
    this.deletedAt = deletedAt;
  }

  setIsFavorite(interestedInvestors) {
    this.isFavorite = interestedInvestors.length > 0 ? true : false;
  }

  /**
   *
   * @param {object} campaignOwnerStoryObj
   * @returns CampaignOwnerStory
   */
  static createFromObject(campaignOwnerStoryObj) {
    const campaignOwnerStory = new CampaignOwnerStory(
      campaignOwnerStoryObj.campaignOwnerStoryId,
      campaignOwnerStoryObj.campaignId,
      campaignOwnerStoryObj.title,
      campaignOwnerStoryObj.description,
      campaignOwnerStoryObj.mediaUri,
    );
    if (
      campaignOwnerStoryObj.campaign &&
      typeof campaignOwnerStoryObj.campaign.interestedInvestors !== 'undefined'
    ) {
      campaignOwnerStory.setIsFavorite(
        campaignOwnerStoryObj.campaign.interestedInvestors,
      );
    }
    if (campaignOwnerStoryObj.campaign) {
      campaignOwnerStory.setCampaign(campaignOwnerStoryObj.campaign);
    }

    if (campaignOwnerStoryObj.createdAt) {
      campaignOwnerStory.setCreatedAt(campaignOwnerStoryObj.createdAt);
    }

    if (campaignOwnerStoryObj.updatedAt) {
      campaignOwnerStory.setUpdatedAt(campaignOwnerStoryObj.updatedAt);
    }

    if (campaignOwnerStoryObj.deletedAt) {
      campaignOwnerStory.setDeletedAT(campaignOwnerStoryObj.deletedAt);
    }

    return campaignOwnerStory;
  }

  /**
   *
   * @param {string} campaignOwnerStory
   * @returns CampaignOwnerStory
   */
  static createFromDetail(
    campaignId: string,
    title: string,
    description: string,
    mediaUri: string,
  ) {
    return new CampaignOwnerStory(uuid(), campaignId, title, description, mediaUri);
  }
}

export default CampaignOwnerStory;
