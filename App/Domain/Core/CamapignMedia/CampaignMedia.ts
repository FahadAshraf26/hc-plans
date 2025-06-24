import uuid from 'uuid/v4';

class CampaignMedia {
  campaignMediaId: string;
  campaignId: string;
  name: string;
  path: string;
  mimeType: string;
  originalPath: string;
  createdAt!: Date;
  updatedAt!: Date;
  deletedAt!: Date;
  position: number;

  constructor(
    campaignMediaId: string,
    campaignId: string,
    name: string,
    path: string,
    mimeType: string,
    originalPath: string,
  ) {
    this.campaignMediaId = campaignMediaId;
    this.campaignId = campaignId;
    this.name = name;
    this.path = path;
    this.mimeType = mimeType;
    this.originalPath = originalPath;
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

  /**
   * @param campaignMediaObject
   * @returns CampaignMedia
   */
  static createFromObject(campaignMediaObject) {
    const campaignMedia = new CampaignMedia(
      campaignMediaObject.campaignMediaId,
      campaignMediaObject.campaignId,
      campaignMediaObject.name,
      campaignMediaObject.path,
      campaignMediaObject.mimeType,
      campaignMediaObject.originalPath,
    );

    if (campaignMediaObject.createdAt) {
      campaignMedia.setCreatedAt(campaignMediaObject.createdAt);
    }

    if (campaignMediaObject.updatedAt) {
      campaignMedia.setUpdatedAt(campaignMediaObject.updatedAt);
    }

    if (campaignMediaObject.deletedAt) {
      campaignMedia.setDeletedAT(campaignMediaObject.deletedAt);
    }

    if (campaignMediaObject.position) {
      campaignMedia.setposition(campaignMediaObject.position)
    }

    return campaignMedia;
  }

  setposition(position) {
    this.position = position;
  }
  getposition() {
    return this.position;
  }

  /**
   *
   * @param campaignId
   * @param name
   * @param path
   * @param mimeType
   * @returns CampaignMedia
   */
  static createFromDetail(
    campaignId?: string,
    name?: string,
    path?: string,
    mimeType?: string,
    originalPath?: string,
  ) {
    return new CampaignMedia(
      uuid(),
      campaignId,
      name,
      path,
      mimeType,
      originalPath,
    );
  }
}

export default CampaignMedia;
