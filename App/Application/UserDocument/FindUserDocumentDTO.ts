class FindUserDocumentDTO {
  private readonly userDocumentId: string;

  constructor(userDocumentId: string) {
    this.userDocumentId = userDocumentId;
  }

  getUserDocumentId() {
    return this.userDocumentId;
  }
}

export default FindUserDocumentDTO;
