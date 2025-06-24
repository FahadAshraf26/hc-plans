import Contact from './Contact';

class ContactMap {
  static toDomain(contactObj) {
    const employeeEntity = Contact.create({ ...contactObj }, contactObj.contactId);

    return employeeEntity;
  }

  static toPersistence(contactEntity) {
    return {
      contactId: contactEntity.contactId(),
      email: contactEntity.email(),
      phone: contactEntity.phone(),
      issuerId: contactEntity.issuerId(),
    };
  }

  static toDTO(contactEntity) {
    return {
      contactId: contactEntity.contactId(),
      email: contactEntity.email(),
      phone: contactEntity.phone(),
      issuerId: contactEntity.issuerId(),
    };
  }
}

export default ContactMap;
