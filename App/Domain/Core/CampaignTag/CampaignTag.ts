import uuid from 'uuid/v4';
import Tag from '../Tag/Tag';
import Campaign from '../Campaign/Campaign';

class CampaignTag {
  campaignTagId: string;
  campaignId: string;
  tagId: string;
  createdAt!: Date;
  updatedAt!: Date;
  deletedAt!: Date;
  tag!: Tag;
  campaign!: Campaign;

  constructor(campaignTagId: string, campaignId: string, tagId: string) {
    this.campaignTagId = campaignTagId;
    this.campaignId = campaignId;
    this.tagId = tagId;
  }

  /**
   * Set Created Date
   * @param {Date} createdAt
   */
  setCreatedAt(createdAt: Date) {
    this.createdAt = createdAt;
  }

  /**
   * Set Updated Date
   * @param {Date} updatedAt
   */
  setUpdatedAt(updatedAt: Date) {
    this.updatedAt = updatedAt;
  }

  /**
   * Set Deleted Date
   * @param {Date} deletedAt
   */
  setDeletedAT(deletedAt: Date) {
    this.deletedAt = deletedAt;
  }

  /**
   * Set Tags
   * @param {Tag} tag
   */
  setTag(tag: Tag) {
    this.tag = tag;
  }

  /**
   * Set Campaign
   * @param {Campagin} campaign
   */
  setCampaign(campaign: Campaign) {
    this.campaign = campaign;
  }

  /**
   * Create CampaignTag object
   * @param {object} campaignTagObject
   * @returns CampaignTag
   */
  static createFromObject(campaignTagObject) {
    const campaignTag = new CampaignTag(
      campaignTagObject.campaignTagId,
      campaignTagObject.campaignId,
      campaignTagObject.tagId,
    );

    if (campaignTagObject.tag) {
      campaignTag.setTag(Tag.createFromObject(campaignTagObject.tag));
    }

    if (campaignTagObject.createdAt) {
      campaignTag.setCreatedAt(campaignTagObject.createdAt);
    }

    if (campaignTagObject.updatedAt) {
      campaignTag.setUpdatedAt(campaignTagObject.updatedAt);
    }

    if (campaignTagObject.deletedAt) {
      campaignTag.setDeletedAT(campaignTagObject.deletedAt);
    }

    return campaignTag;
  }

  /**
   * Create CampaignTag Object with Id
   * @param {string} campaignId
   * @param {string} tagId
   * @returns CampaignTag
   */
  static createFromDetail(campaignId: string, tagId: string) {
    return new CampaignTag(uuid(), campaignId, tagId);
  }
}

export default CampaignTag;
