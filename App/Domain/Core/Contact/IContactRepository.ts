import Contact from './Contact';

export const IContactRepositoryId = Symbol.for('IContactRepository');

export interface IContactRepository {
  add(contactEntity: Contact): Promise<boolean>;
  addBulk(contactEntities: Array<Contact>): Promise<boolean>;
  fetchById(contactId: string): Promise<boolean | Contact>;
  fetchAll(issuerId: string): Promise<Array<Contact>>;
  update(contactEntity: Contact): Promise<boolean>;
  remove(contactId: string, hardDelete: boolean): Promise<boolean>;
}
