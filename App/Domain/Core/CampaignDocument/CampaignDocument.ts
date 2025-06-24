import BaseEntity from '@domain/Core/BaseEntity/BaseEntity';
import uuid from 'uuid/v4';

class CampaignDocument extends BaseEntity {
  campaignDocumentId: string;
  private campaignId: string;
  private documentType: string;
  private name: string;
  path: string;
  private mimeType: string;
  private ext: string;
  private campaign: any;

  constructor(
    campaignDocumentId: string,
    campaignId: string,
    documentType: string,
    name: string,
    path: string,
    mimeType: string,
    ext: string,
  ) {
    super();
    this.campaignDocumentId = campaignDocumentId;
    this.campaignId = campaignId;
    this.documentType = documentType;
    this.name = name;
    this.path = path;
    this.mimeType = mimeType;
    this.ext = ext;
  }

  /**
   *
   * @param {Campaign} campaign
   */
  setCampaign(campaign) {
    this.campaign = campaign;
  }

  /**
   *
   * @param {object} campaignDocumentObj
   * @returns CampaignDocument
   */
  static createFromObject(campaignDocumentObj): CampaignDocument {
    const campaignDocument = new CampaignDocument(
      campaignDocumentObj.campaignDocumentId,
      campaignDocumentObj.campaignId,
      campaignDocumentObj.documentType,
      campaignDocumentObj.name,
      campaignDocumentObj.path,
      campaignDocumentObj.mimeType,
      campaignDocumentObj.ext,
    );

    if (campaignDocumentObj.campaign) {
      campaignDocument.setCampaign(campaignDocumentObj.campaign);
    }

    if (campaignDocumentObj.createdAt) {
      campaignDocument.setCreatedAt(campaignDocumentObj.createdAt);
    }

    if (campaignDocumentObj.updatedAt) {
      campaignDocument.setUpdatedAt(campaignDocumentObj.updatedAt);
    }

    if (campaignDocumentObj.deletedAt) {
      campaignDocument.setDeletedAT(campaignDocumentObj.deletedAt);
    }

    return campaignDocument;
  }

  /**
   *
   * @param {string} campaignId
   * @param {string} documentType
   * @param {string} name
   * @param {string} path
   * @param {string} mimeType
   * @param {string} ext
   * @returns CampaignDocument
   *
   */
  static createFromDetail(
    campaignId,
    documentType,
    name,
    path,
    mimeType,
    ext,
  ): CampaignDocument {
    return new CampaignDocument(
      uuid(),
      campaignId,
      documentType,
      name,
      path,
      mimeType,
      ext,
    );
  }

  getCampaignDocumentPath() {
    return this.path;
  }
}

export default CampaignDocument;
