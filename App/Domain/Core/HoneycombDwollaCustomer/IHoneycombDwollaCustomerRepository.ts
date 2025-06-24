import HoneycombDwollaCustomer from './HoneycombDwollaCustomer';

export const IHoneycombDwollaCustomerRepositoryId = Symbol.for(
  'IHoneycombDwollaCustomerRepository',
);

export interface IHoneycombDwollaCustomerRepository {
  createHoneycombDwollaCustomer(entity: HoneycombDwollaCustomer): Promise<boolean>;
  fetchByIssuerId(issuerId: string): Promise<HoneycombDwollaCustomer>;
  fetchByDwollaCustomerId(customerId: string): Promise<HoneycombDwollaCustomer>;
  fetchByUserId(userId: string): Promise<HoneycombDwollaCustomer>;
  fetchByCustomerTypeAndUser(
    userId: string,
    customerType: string,
  ): Promise<HoneycombDwollaCustomer>;
  fetchAllByUserId(userId: string): Promise<any>;
  updateBusinessCustomerDwollaBalanceId(
    dwollaCustomerId: string,
    dwollaBalanceId: string,
  ): Promise<boolean>;
  updateByIssuer(entity: HoneycombDwollaCustomer): Promise<boolean>;
  fetchByDocumentId(dwollaDocumentId: string): Promise<HoneycombDwollaCustomer>;
}
