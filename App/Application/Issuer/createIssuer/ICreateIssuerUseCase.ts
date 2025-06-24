import Issuer from '@domain/Core/Issuer/Issuer';
import User from '@domain/Core/User/User';

export const ICreateIssuerUseCaseId = Symbol.for('ICreateIssuerUseCase');

export interface ICreateIssuerUseCase {
  fetchOwners(ownerIds: string[]): Promise<any>;
  setOwners(issuer, dto): Promise<Issuer>;
  getPrimaryOwnerDetails(issuer: Issuer): Promise<User>;
  persistIssur(issuer: Issuer): Promise<Issuer>;
  createNcIssuer(issuer: Issuer, dto);
  execute(dto): Promise<boolean>;
}
