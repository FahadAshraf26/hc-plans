import GetAllIssuersDTO from '@application/Issuer/GetAllIssuersDTO';
import Issuer from '@domain/Core/Issuer/Issuer';
import GetAllIssuersByOwnerDTO from '@application/Issuer/GetAllIssuersByOwnerDTO';
import GetOneIssuerDTO from '@application/Issuer/GetOneIssuerDTO';
import UpdateIssuerDTO from '@application/Issuer/UpdateIssuerDTO';
import DeleteIssuerDTO from '@application/Issuer/DeleteIssuerDTO';
import GetIssuerInfoDTO from '@application/Issuer/GetIssuerInfoDTO';
import RetryBusinessDwollaDTO from './RetryDwollaBusinessDTO';

export const IIssuerServiceId = Symbol.for('IIssuerService');

export interface IIssuerService {
  getAllIssuers(getAllIssuersDTO: GetAllIssuersDTO): Promise<any>;
  getAllIssuersByOwner(getAllIssuersByOwnerDTO: GetAllIssuersByOwnerDTO): Promise<any>;
  findIssuer(getOneIssuerDTO: GetOneIssuerDTO): Promise<Issuer>;
  updateIssuer(updateIssuerDTO: UpdateIssuerDTO): Promise<boolean>;
  removeIssuer(deleteIssuerDTO: DeleteIssuerDTO): Promise<boolean>;
  getIssuerInfo(getIssuerInfoDTO: GetIssuerInfoDTO): Promise<boolean>;
  retryDwollaBusiness(retryBusinessDwollaDTO: RetryBusinessDwollaDTO): Promise<any>;
  updateDwollaCustomer(customerId: string): Promise<any>;
  updateDwollaBusinessCustomer(customerId: string, input: any): Promise<any>;
  updateBusinessCustomerDwollaBalanceId(customerId: string, dwollaBalanceId: string): Promise<any>;
  getDwollaBeneficialOwner(dwollaCustomerId: string): Promise<any>;
}
