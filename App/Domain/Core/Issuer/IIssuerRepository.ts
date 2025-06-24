import { IBaseRepository } from '@domain/Core/BaseEntity/IBaseRepository';
import PaginationData from '@domain/Utils/PaginationData';
import Issuer from '@domain/Core/Issuer/Issuer';

export const IIssuerRepositoryId = Symbol.for('IIssuerRepository');

export interface IIssuerRepository extends IBaseRepository {
  add(issuer): Promise<boolean>;
  fetchAll({ paginationOptions, options }): Promise<PaginationData<Issuer>>;
  fetchAllByOwner(
    ownerId: string,
    paginationOptions,
    showTrashed: boolean,
  ): Promise<PaginationData<Issuer>>;
  fetchById(issuerId: string): Promise<Issuer>;
  fetchByName(issuerName: string): Promise<Issuer>;
  update(issuer: Issuer): Promise<boolean>;
  remove(issuer: Issuer, hardDelete: boolean): Promise<boolean>;
  _updateIssuerOwnerRef(issuer: Issuer): Promise<any>;
  fetchIssuerInfoById(issuerId: string): Promise<any>;
  fetchByDwollaCustomerId(dwollaCustomerId: string): Promise<any>;
  fetchByEmail(email: string): Promise<Issuer>;
  updateIssuer(issuer: any): Promise<boolean>;
}
