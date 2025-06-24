import IssuerDocument from '@domain/Core/IssuerDocument/IssuerDocument';

class CreateIssuerDocumentDTO {
  private document: any;

  constructor(issuerId, documentType, name, path, mimeType, ext) {
    this.document = IssuerDocument.createFromDetail(
      issuerId,
      documentType,
      name,
      path,
      mimeType,
      ext,
    );
  }

  getIssuerDocument() {
    return this.document;
  }
}

export default CreateIssuerDocumentDTO;
