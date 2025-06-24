import uuid from 'uuid/v4';
import BaseEntity from '@domain/Core/BaseEntity/BaseEntity';

class CampaignNewsMedia extends BaseEntity {
  private campaignNewsMediaId: string;
  private campaignNewsId: string;
  private path: string;
  private mimeType: string;
  private originalPath: string;

  constructor(
    campaignNewsMediaId: string,
    campaignNewsId: string,
    path: string,
    mimeType: string,
    originalPath: string,
  ) {
    super();
    this.campaignNewsMediaId = campaignNewsMediaId;
    this.campaignNewsId = campaignNewsId;
    this.path = path;
    this.mimeType = mimeType;
    this.originalPath = originalPath;
  }

  /**
   *
   * @param {object} campaignNewsMediaObject
   * @returns CampaignNewsMedia
   */
  static createFromObject(campaignNewsMediaObject): CampaignNewsMedia {
    const campaignNewsMedia = new CampaignNewsMedia(
      campaignNewsMediaObject.campaignNewsMediaId,
      campaignNewsMediaObject.campaignNewsId,
      campaignNewsMediaObject.path,
      campaignNewsMediaObject.mimeType,
      campaignNewsMediaObject.originalPath,
    );

    if (campaignNewsMediaObject.createdAt) {
      campaignNewsMedia.setCreatedAt(campaignNewsMediaObject.createdAt);
    }

    if (campaignNewsMediaObject.updatedAt) {
      campaignNewsMedia.setUpdatedAt(campaignNewsMediaObject.updatedAt);
    }

    if (campaignNewsMediaObject.deletedAt) {
      campaignNewsMedia.setDeletedAT(campaignNewsMediaObject.deletedAt);
    }

    return campaignNewsMedia;
  }

  /**
   *
   * @param {string} campaignNewsId
   * @param path
   * @param mimeType
   * @param originalPath
   * @returns CampaignNewsMedia
   */
  static createFromDetail(
    campaignNewsId: string,
    path: string,
    mimeType: string,
    originalPath: string,
  ): CampaignNewsMedia {
    return new CampaignNewsMedia(uuid(), campaignNewsId, path, mimeType, originalPath);
  }
}

export default CampaignNewsMedia;
