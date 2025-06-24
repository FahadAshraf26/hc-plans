import CampaignDocument from '@domain/Core/CampaignDocument/CampaignDocument';

class UpdateCampaignDocumentDTO {
  private document: any;

  constructor(campaignDocumentObj) {
    if (campaignDocumentObj.mimetype) {
      campaignDocumentObj.mimeType = campaignDocumentObj.mimetype;
    }

    this.document = CampaignDocument.createFromObject(campaignDocumentObj);
  }

  getCampaignDocumentId() {
    return this.document.campaignDocumentId;
  }

  getCampaignDocument() {
    return this.document;
  }
}

export default UpdateCampaignDocumentDTO;
