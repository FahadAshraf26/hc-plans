import CreateContactDTO from '../../Application/Contact/CreateContactDTO';
import UpdateContactDTO from '../../Application/Contact/UpdateContactDTO';
import DeleteContactDTO from '../../Application/Contact/DeleteContactDTO';
import ContactService from '../../Application/Contact/ContactService';
import { injectable } from 'inversify';

@injectable()
class ContactController {
  constructor(private contactService: ContactService) {}

  getContacts = async (httpRequest) => {
    const { issuerId } = httpRequest.params;

    const dto = CreateContactDTO.create({
      issuerId,
    });

    const contacts = await this.contactService.getContacts(dto);

    return { body: contacts };
  };

  findContact = async (httpRequest) => {
    const { contactId } = httpRequest.params;

    const dto = {
      contactId,
    };

    const contact = await this.contactService.findContact(dto);

    return {
      body: {
        status: 'success',
        data: contact,
      },
    };
  };

  updateContact = async (httpRequest) => {
    const { issuerId, contactId } = httpRequest.params;
    const { body } = httpRequest;

    const dto = UpdateContactDTO.create({
      contactId,
      issuerId,
      ...body,
    });

    await this.contactService.updateContact(dto);

    return {
      body: {
        status: 'success',
        message: 'contact updated successfully',
      },
    };
  };

  removeContact = async (httpRequest) => {
    const { contactId } = httpRequest.params;
    const { hardDelete = false } = httpRequest.query;

    const dto = new DeleteContactDTO(contactId, hardDelete);

    await this.contactService.removeContact(dto);

    return {
      body: {
        status: 'success',
        message: 'contact deleted successfully',
      },
    };
  };

  createContact = async (httpRequest) => {
    const { issuerId } = httpRequest.params;
    const { body } = httpRequest;

    const dto = CreateContactDTO.create({
      issuerId,
      ...body,
    });

    await this.contactService.createContact(dto);

    return {
      body: {
        status: 'success',
        message: 'contact created successfully',
      },
    };
  };
}

export default ContactController;
