import UserDocument from '@domain/Core/UserDocument/UserDocument';

class UpdateUserDocumentDTO {
  private readonly document: UserDocument;
  constructor(userDocumentObj: any) {
    if (userDocumentObj.mimetype) {
      userDocumentObj.mimeType = userDocumentObj.mimetype;
    }

    this.document = UserDocument.createFromObject(userDocumentObj);
  }

  getUserDocumentId() {
    return this.document.userDocumentId;
  }

  getUserDocument() {
    return this.document;
  }
}

export default UpdateUserDocumentDTO;
