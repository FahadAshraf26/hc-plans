import uuid from 'uuid/v4';

type contactProps = {
  contact: {
    email: string;
    phone: string;
  };
  issuerId: string;
};

class Contact {
  _contactId: string | undefined;
  _props: {
    contact: {
      email: string;
      phone: string;
    };
    issuerId: string;
  };

  constructor(props: contactProps, contactId?: string | undefined) {
    this._contactId = contactId;
    this._props = props;
  }

  contactId(): string | undefined {
    return this._contactId;
  }

  email(): string {
    return this._props.contact.email;
  }

  phone(): string {
    return this._props.contact.phone;
  }

  issuerId(): string {
    return this._props.issuerId;
  }

  static create(contactProps, contactId?: string) {
    if (!contactId) {
      contactId = uuid();
    }
    return new Contact(contactProps, contactId);
  }
}

export default Contact;
