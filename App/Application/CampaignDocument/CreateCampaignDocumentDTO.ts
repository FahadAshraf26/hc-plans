import CampaignDocument from '@domain/Core/CampaignDocument/CampaignDocument';

class CreateCampaignDocumentDTO {
  private document: any;

  constructor(
    campaignId: string,
    documentType: string,
    name: string,
    path: string,
    mimeType: string,
    ext: string,
  ) {
    this.document = CampaignDocument.createFromDetail(
      campaignId,
      documentType,
      name,
      path,
      mimeType,
      ext,
    );
  }

  getCampaignDocument() {
    return this.document;
  }
}

export default CreateCampaignDocumentDTO;
