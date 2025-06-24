import IssuerDocument from '@domain/Core/IssuerDocument/IssuerDocument';

class UpdateIssuerDocumentDTO {
  private document: any;

  constructor(issuerDocumentObj) {
    if (issuerDocumentObj.mimetype) {
      issuerDocumentObj.mimeType = issuerDocumentObj.mimetype;
    }

    this.document = IssuerDocument.createFromObject(issuerDocumentObj);
  }

  getIssuerDocumentId() {
    return this.document.issuerDocumentId;
  }

  getIssuerDocument() {
    return this.document;
  }
}

export default UpdateIssuerDocumentDTO;
