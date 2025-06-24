class CreateMultipleUserDocumentDTO {
  documents: any;
  userId: string;
  documentType: string;
  name: string;
  year: number;

  constructor(
    userId: string,
    documentType: string,
    name: string,
    documents: any,
    year: number = new Date().getFullYear(),
  ) {
    this.userId = userId;
    this.documentType = documentType;
    this.name = name;
    this.documents = documents;
    this.year = year;
  }

  getUserId() {
    return this.userId;
  }

  getDocumentType() {
    return this.documentType;
  }

  getName() {
    return this.name;
  }

  getDocuments() {
    return this.documents;
  }
}

export default CreateMultipleUserDocumentDTO;
