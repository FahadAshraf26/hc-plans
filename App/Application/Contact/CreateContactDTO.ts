import Contact from '../../Domain/Core/Contact/Contact';

class CreateContactDTO {
  private issuerId: string;
  private contacts?: [];

  constructor(issuerId: string, contacts?: []) {
    (this.issuerId = issuerId), (this.contacts = contacts);
  }

  getIssuerId(): string {
    return this.issuerId;
  }

  getContacts(): {} {
    const { contacts, issuerId } = this;

    return contacts!.map((contact) => {
      return Contact.create({ contact, issuerId });
    });
  }

  static create({ issuerId, contacts }: { issuerId: string; contacts?: [] }) {
    return new CreateContactDTO(issuerId, contacts);
  }
}

export default CreateContactDTO;
