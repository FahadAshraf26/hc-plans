import { IBaseRepository } from '../BaseEntity/IBaseRepository';
import Issuer from '../Issuer/Issuer';
import Owner from '../Owner/Owner';
import IssuerOwner from './IssuerOwner';

export const IIssuerOwnerDAOId = Symbol.for('IIssuerOwnerDAO');

export interface IIssuerOwnerDAO extends IBaseRepository {
  fetchByOwnerId(ownerId: string): Promise<IssuerOwner>;
  upsert(issuerOwner: IssuerOwner): Promise<boolean>;
  removeByIssuerOwner(
    issuer: Issuer,
    owner: Owner,
    hardDelete: boolean,
  ): Promise<boolean>;
  removeByIssuerId(issuer: Issuer): Promise<boolean>;
}
