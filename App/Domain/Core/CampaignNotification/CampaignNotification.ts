import uuid from 'uuid/v4';
import BaseEntity from '../BaseEntity/BaseEntity';

class CampaignNotification extends BaseEntity {
  private campaignNotificationId: string;
  private isSeen: boolean;
  private campaignId: string;
  private investorId: string;
  private campaignNewsId: string;
  private campaign: any;
  private campaignNews: any;

  constructor(campaignNotificationId: string, isSeen: boolean) {
    super();
    this.campaignNotificationId = campaignNotificationId;
    this.isSeen = isSeen;
  }

  setInvestorId(investorId) {
    this.investorId = investorId;
  }

  setCampaignId(campaignId) {
    this.campaignId = campaignId;
  }

  setCampaignNewsId(campaignNewsId) {
    this.campaignNewsId = campaignNewsId
  }

  setCampaign(campaign) {
    this.campaign = campaign;
  }

  setCampaignNews(campaignNews) {
    this.campaignNews = campaignNews
  }

  static createFromObject(campaignNotificationObj: CampaignNotification) {
    const campaignNotification = new CampaignNotification(
      campaignNotificationObj.campaignNotificationId,
      campaignNotificationObj.isSeen,
    );

    if (campaignNotificationObj.createdAt) {
      campaignNotification.setCreatedAt(campaignNotificationObj.createdAt);
    }

    if (campaignNotificationObj.updatedAt) {
      campaignNotification.setUpdatedAt(campaignNotificationObj.updatedAt);
    }

    if (campaignNotificationObj.deletedAt) {
      campaignNotification.setDeletedAT(campaignNotificationObj.deletedAt);
    }

    if (campaignNotificationObj.investorId) {
      campaignNotification.setInvestorId(campaignNotificationObj.investorId);
    }

    if (campaignNotificationObj.campaignId) {
      campaignNotification.setCampaignId(campaignNotificationObj.campaignId);
    }

    if (campaignNotificationObj.campaignNewsId) {
      campaignNotification.setCampaignNewsId(campaignNotificationObj.campaignNewsId)
    }

    return campaignNotification;
  }

  static createFromDetail(campaignNotificationObj) {
    return new CampaignNotification(uuid(), campaignNotificationObj.isSeen);
  }
}

export default CampaignNotification;
