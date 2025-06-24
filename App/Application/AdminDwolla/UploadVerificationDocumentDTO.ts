class UploadVerificationDocumentDTO {
  private readonly email: string;
  private readonly document: any;
  private readonly documentType: string;

  constructor(email: string, document: any, documentType: string) {
    this.email = email;
    this.document = document;
    this.documentType = documentType;
  }

  getEmail() {
    return this.email;
  }

  getDocument() {
    return this.document;
  }

  getDocumentType() {
    return this.documentType;
  }
}

export default UploadVerificationDocumentDTO;
