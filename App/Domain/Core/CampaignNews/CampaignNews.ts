import uuid from 'uuid/v4';
import BaseEntity from '@domain/Core/BaseEntity/BaseEntity';

class CampaignNews extends BaseEntity {
  private campaignNewsId: string;
  private campaignId: string;
  title: string;
  private description: string;
  private hyperLink: string;
  private hyperLinkText: string;
  campaignMedia: any;
  campaign: any;

  constructor(
    campaignNewsId: string,
    campaignId: string,
    title: string,
    description: string,
    hyperLink: string,
    hyperLinkText: string,
  ) {
    super();
    this.campaignNewsId = campaignNewsId;
    this.campaignId = campaignId;
    this.title = title;
    this.description = description;
    this.campaignMedia = [];
    this.hyperLink = hyperLink;
    this.hyperLinkText = hyperLinkText;
  }

  /**
   * set media for a campaign
   */
  setMedia(media) {
    const alreadyExists = this.campaignMedia.find(
      (campaignmedia) => campaignmedia.campaignNewsMediaId === media.campaignNewsMediaId,
    );
    if (!alreadyExists) {
      this.campaignMedia.push(media);
    }
  }

  /**
   * remove media for a campaign
   * @param {*} media
   */
  removeMedia(media) {
    const mediaIndex = this.campaignMedia.findIndex(
      (campaignmedia) => campaignmedia.campaignNewsMediaId === media.campaignNewsMediaId,
    );

    if (mediaIndex > -1) {
      this.campaignMedia.splice(mediaIndex, 1);
    }
  }

  /**
   * Set Campaign
   * @param {Campaign} campaign
   */
  setCampaign(campaign) {
    this.campaign = campaign;
  }

  /**
   *
   * @param {object} campaignNewsObj
   * @returns CampaignNews
   */
  static createFromObject(campaignNewsObj): CampaignNews {
    const campaignNews = new CampaignNews(
      campaignNewsObj.campaignNewsId,
      campaignNewsObj.campaignId,
      campaignNewsObj.title,
      campaignNewsObj.description,
      campaignNewsObj.hyperLink,
      campaignNewsObj.hyperLinkText,
    );

    if (campaignNewsObj.campaign) {
      campaignNews.setCampaign(campaignNewsObj.campaign);
    }

    if (campaignNewsObj.createdAt) {
      campaignNews.setCreatedAt(campaignNewsObj.createdAt);
    }
    if (campaignNewsObj.updatedAt) {
      campaignNews.setUpdatedAt(campaignNewsObj.updatedAt);
    }

    if (campaignNewsObj.deletedAt) {
      campaignNews.setDeletedAT(campaignNewsObj.deletedAt);
    }

    return campaignNews;
  }

  getCampaignNewsId() {
    return this.campaignNewsId;
  }

  /**
   *
   * @param {string} campaignId
   * @param {string} title
   * @param {string} description
   * @returns CampaignNews
   */
  static createFromDetail(
    campaignId: string,
    title: string,
    description: string,
    hyperLink: string = '',
    hyperLinkText: string = '',
  ): CampaignNews {
    return new CampaignNews(
      uuid(),
      campaignId,
      title,
      description,
      hyperLink,
      hyperLinkText,
    );
  }
}

export default CampaignNews;
