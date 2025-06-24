class RemoveUserDocumentDTO {
  private readonly userDocumentId: string;
  private readonly hardDelete: boolean;

  constructor(userDocumentId: string, hardDelete: boolean = false) {
    this.userDocumentId = userDocumentId;
    this.hardDelete = hardDelete;
  }

  getUserDocumentId() {
    return this.userDocumentId;
  }

  shouldHardDelete() {
    return this.hardDelete === true;
  }
}

export default RemoveUserDocumentDTO;
