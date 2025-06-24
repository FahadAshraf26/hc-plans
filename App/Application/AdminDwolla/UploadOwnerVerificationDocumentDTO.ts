class UploadOwnerVerificationDocuments {
  private readonly beneficialOwnerId: string;
  private readonly document: any;
  private readonly documentType: string;

  constructor(beneficialOwnerId: string, document: any, documentType: string) {
    this.beneficialOwnerId = beneficialOwnerId;
    this.document = document;
    this.documentType = documentType;
  }

  getBeneficialOwnerId() {
    return this.beneficialOwnerId;
  }

  getDocument() {
    return this.document;
  }

  getDocumentType() {
    return this.documentType;
  }
}

export default UploadOwnerVerificationDocuments