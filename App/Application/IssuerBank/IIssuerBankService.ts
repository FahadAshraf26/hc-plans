import IssuerBank from '@domain/Core/IssuerBank/IssuerBank';
import { PaginationDataResponse } from '@domain/Utils/PaginationData';
import AddIssuerBankWithAuthorizationDTO from './AddIssuerBankWithAuthorizationDTO';
import UpdateIssuerBankDTO from './UpdateIssuerBankDTO';

export const IIssuerBankServiceId = 'IIssuerBankService';
export interface IIssuerBankService {
  addBank(addIssuerBankDTO): Promise<boolean>;
  getBanks(getIssuerBanksDTO): Promise<PaginationDataResponse<IssuerBank>>;
  removeBank(removeIssuerBankDTO): Promise<boolean>;
  addIssuerBankWithAuthorization(
    addIssuerBankWithAuthorizationDTO: AddIssuerBankWithAuthorizationDTO,
  ): Promise<boolean>;
  updateBank(updateIssuerBankDTO: UpdateIssuerBankDTO): Promise<boolean>;
}
