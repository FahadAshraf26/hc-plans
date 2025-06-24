class UpdateContactDTO {
  private issuerId: string;
  private contactId: string;
  private contact: string;

  constructor(issuerId: string, contactId: string, contact: string) {
    (this.issuerId = issuerId), (this.contactId = contactId), (this.contact = contact);
  }

  getIssuerId(): string {
    return this.issuerId;
  }

  getContactId(): string {
    return this.contactId;
  }

  static create({ issuerId, contactId, contact }) {
    return new UpdateContactDTO(issuerId, contactId, contact);
  }
}

export default UpdateContactDTO;
