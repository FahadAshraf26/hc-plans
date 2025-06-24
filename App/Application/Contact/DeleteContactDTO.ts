class DeleteContactDTO {
  private contactId: string;
  private hardDelete: string;

  constructor(contactId: string, hardDelete: string) {
    this.contactId = contactId;
    this.hardDelete = hardDelete;
  }

  getContactId(): string {
    return this.contactId;
  }

  shouldHardDelete(): boolean {
    return this.hardDelete === 'true';
  }
}

export default DeleteContactDTO;
