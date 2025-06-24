import { injectable, inject } from 'inversify';
import Contact from '../../Domain/Core/Contact/Contact';
import ContactMap from '../../Domain/Core/Contact/ContactMap';
import HttpException from '../../Infrastructure/Errors/HttpException';
import CreateContactDTO from './CreateContactDTO';
import DeleteContactDTO from './DeleteContactDTO';
import UpdateContactDTO from './UpdateContactDTO';
import {
  IContactRepository,
  IContactRepositoryId,
} from '../../Domain/Core/Contact/IContactRepository';
import {
  IIssuerRepository,
  IIssuerRepositoryId,
} from '../../Domain/Core/Issuer/IIssuerRepository';

@injectable()
class ContactService {
  constructor(
    @inject(IContactRepositoryId) private contactRepository: IContactRepository,
    @inject(IIssuerRepositoryId) private issuerRepository: IIssuerRepository,
  ) {}

  async getContacts(getContactsDTO: CreateContactDTO) {
    const result = await this.contactRepository.fetchAll(getContactsDTO.getIssuerId());

    return result.map((Contact: Contact) => {
      return ContactMap.toDTO(Contact);
    });
  }

  async findContact(findContactDTO: { contactId: string }) {
    const Contact = await this.contactRepository.fetchById(findContactDTO.contactId);

    if (!Contact) {
      throw new HttpException(404, 'no contact record found against the provided input');
    }

    return ContactMap.toDTO(Contact);
  }

  async updateContact(updateContactDTO: UpdateContactDTO) {
    const result = await this.contactRepository.fetchById(
      updateContactDTO.getContactId(),
    );

    if (!result) {
      throw new HttpException(404, 'no contact record found against the provided input');
    }

    const contactEntity = Contact.create(
      updateContactDTO,
      updateContactDTO.getContactId(),
    );

    const updateContact = await this.contactRepository.update(contactEntity);

    if (!updateContact) {
      throw new HttpException(400, "Contact didn't updated");
    }

    return updateContact;
  }

  async removeContact(deleteContactDTO: DeleteContactDTO) {
    const Contact = await this.contactRepository.fetchById(
      deleteContactDTO.getContactId(),
    );

    if (!Contact) {
      throw new HttpException(404, 'no contact record found against the provided input');
    }

    const result = await this.contactRepository.remove(
      deleteContactDTO.getContactId(),
      deleteContactDTO.shouldHardDelete(),
    );

    if (!result) {
      throw new HttpException(400, "Contact didn't deleted");
    }

    return result;
  }

  async createContact(createContactDTO) {
    const issuer = await this.issuerRepository.fetchById(createContactDTO.getIssuerId());

    if (!issuer) {
      throw new HttpException(400, 'Cannot add contacts');
    }

    let result;
    if (createContactDTO.getContacts().length === 1) {
      result = await this.contactRepository.add(createContactDTO.getContacts());
    } else {
      result = await this.contactRepository.addBulk(createContactDTO.getContacts());
    }

    if (!result) {
      throw new HttpException(400, "Contact didn't created");
    }

    return result;
  }
}

export default ContactService;
