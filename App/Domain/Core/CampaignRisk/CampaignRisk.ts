import uuid from 'uuid/v4';
import Campaign from '../Campaign/Campaign';
import BaseEntity from '@domain/Core/BaseEntity/BaseEntity';

class CampaignRisk extends BaseEntity {
  campaignRiskId: string;
  campaignId: string;
  private title: string;
  private description: string;
  private campaign!: Campaign;

  constructor(
    campaignRiskId: string,
    campaignId: string,
    title: string,
    description: string,
  ) {
    super();
    this.campaignRiskId = campaignRiskId;
    this.campaignId = campaignId;
    this.title = title;
    this.description = description;
  }

  setCampaign(campaign: Campaign) {
    this.campaign = campaign;
  }

  /**
   *
   * @param {object} campaignRiskObj
   * @returns CampaignRisk
   */
  static createFromObject(campaignRiskObj) {
    const campaignRisk = new CampaignRisk(
      campaignRiskObj.campaignRiskId,
      campaignRiskObj.campaignId,
      campaignRiskObj.title,
      campaignRiskObj.description,
    );

    if (campaignRiskObj.campaign) {
      campaignRisk.setCampaign(campaignRiskObj.campaign);
    }

    if (campaignRiskObj.createdAt) {
      campaignRisk.setCreatedAt(campaignRiskObj.createdAt);
    }

    if (campaignRiskObj.updatedAt) {
      campaignRisk.setUpdatedAt(campaignRiskObj.updatedAt);
    }

    if (campaignRiskObj.deletedAt) {
      campaignRisk.setDeletedAT(campaignRiskObj.deletedAt);
    }

    return campaignRisk;
  }

  /**
   *
   * @param {string} campaignRisk
   * @returns CampaignRisk
   */
  static createFromDetail(campaignId: string, title: string, description: string) {
    return new CampaignRisk(uuid(), campaignId, title, description);
  }
}

export default CampaignRisk;
