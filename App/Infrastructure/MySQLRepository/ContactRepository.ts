import models from '../Model';
import DatabaseError from '../Errors/DatabaseError';
import ContactMap from '@domain/Core/Contact/ContactMap';
import { injectable } from 'inversify';
import { IContactRepository } from '@domain/Core/Contact/IContactRepository';
const { ContactModel } = models;

@injectable()
class ContactRepository implements IContactRepository {
  async add(contactEntity) {
    try {
      let contactObj = ContactMap.toPersistence(contactEntity[0]);

      await ContactModel.create(contactObj);

      return true;
    } catch (e) {
      throw new DatabaseError(e);
    }
  }

  async addBulk(contactEntities) {
    try {
      let contactObjs = contactEntities.map((contactEntity) => {
        return ContactMap.toPersistence(contactEntity);
      });

      await ContactModel.bulkCreate(contactObjs);

      return true;
    } catch (e) {
      throw new DatabaseError(e);
    }
  }

  async fetchById(contactId) {
    try {
      const result = await ContactModel.findOne({
        where: {
          contactId,
        },
        raw: true,
      });

      if (!result) {
        return false;
      }

      result.contact = { email: result.email, phone: result.phone };
      return ContactMap.toDomain(result);
    } catch (e) {
      throw new DatabaseError(e);
    }
  }

  async fetchAll(issuerId) {
    try {
      const results = await ContactModel.findAll({
        where: {
          issuerId,
        },
        raw: true,
      });

      return results.map((result) => {
        result.contact = { email: result.email, phone: result.phone };
        return ContactMap.toDomain(result);
      });
    } catch (e) {
      throw new DatabaseError(e);
    }
  }

  async update(contactEntity) {
    try {
      const contactObj = ContactMap.toPersistence(contactEntity);

      await ContactModel.update(contactObj, {
        where: { contactId: contactObj.contactId },
      });

      return true;
    } catch (e) {
      throw new DatabaseError(e);
    }
  }

  async remove(contactId) {
    try {
      await ContactModel.destroy({
        where: { contactId },
      });

      return true;
    } catch (e) {
      throw new DatabaseError(e);
    }
  }
}

export default ContactRepository;
