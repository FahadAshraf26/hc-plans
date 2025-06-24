import User from '@domain/Core/User/User';
import Issuer from '@domain/Core/Issuer/Issuer';

export const IDwollaServiceId = Symbol.for('IDwollaService');
type BusinessInput = {
  userDetails?: any;
  title?: string;
  currentValues?: any;
};
type CustomerDocument = {
  customerId: string;
  file: any;
  documentType: string;
};
type BeneficialOwnerDocument = {
  beneficialOwnerId: string;
  file: any;
  documentType: string;
}
type UpsertCustomer = {
  dwollaCustomerId?: string;
  input?: any;
  idempotencyKey?: string;
};
type UpsertInvestor = {
  user: User;
  currentValues: any;
  isAdmin: boolean;
};
type FundingSourceOption = {
  fetchSources: any;
  sources: any;
};
type VerifyFundingSource = {
  fundingSourceId: string;
  firstTransactionAmount: number;
  secondTransactionAmount: number;
};
type CreateTransfer = {
  sourceId: string;
  destinationId: string;
  amount: number;
  fee: any;
  sameDayACH: boolean;
  idempotencyKey: string;
};
export interface IDwollaService {
  createCustomerInput(user: User, isCustomer: boolean): any;
  createBusinessInput(
    issuer: Issuer,
    { userDetails, title, currentValues }: BusinessInput,
  ): any;
  createBenenficialOwnerInpupt(user: User): any;
  createBeneficialOwner(customerId: string, beneficialOwnerInput: any): Promise<string>;
  updateBeneficialOwner(beneficialOwnerId: string, beneficialOwnerInput: any): Promise<string>;
  getBeneficialOwner(beneficialOwnerID: string): Promise<any>;
  listBeneficialOwners(customerId: string): Promise<any>;
  createCustomer(input: any, idempotencyKey: any): Promise<string>;
  getCustomer(customerId: string): Promise<any>;
  getCustomerByEmail(emailId: string): Promise<any>;
  createCustomerDocument({
    customerId,
    file,
    documentType,
  }: CustomerDocument): Promise<any>;
  upsertCustomer({
    dwollaCustomerId,
    input,
    idempotencyKey,
  }: UpsertCustomer): Promise<string>;
  upsertInvestor({ user, currentValues, isAdmin }: UpsertInvestor): Promise<User>;
  updateCustomer(customerId: string, input: any): Promise<string>;
  addFundingSource(customerId: string, input: any): Promise<any>;
  retrieveFundingSource(fundingSourceId: string): Promise<any>;
  retrieveFundingSourceBalance(fundingSourceId: string): Promise<any>;
  getFundingSource(
    customerId: string,
    input: any,
    options: FundingSourceOption,
  ): Promise<any>;
  makeMicroDeposits(fundingSourceId: string): Promise<any>;
  verifyFundingSource({
    fundingSourceId,
    firstTransactionAmount,
    secondTransactionAmount,
  }: VerifyFundingSource): Promise<boolean>;
  getIdempotencyHeader(idempotencyKey: string): any;
  listCustomerTransfer(customerUrl: string): void;
  createTransfer({
    sourceId,
    destinationId,
    amount,
    fee,
    sameDayACH,
    idempotencyKey,
  }: CreateTransfer): Promise<any>;
  parseError(error: any): any;
  createFee(amount: number, customerId: string): any;
  retrieveTransfer(transferId: string): Promise<any>;
  createMassPayment(sourceId: string, destinations: any, options: any): Promise<any>;
  listFundingSources(customerId: string): Promise<any>;
  getBusinessClassifications(): Promise<any>;
  certifyOwner(customerId: string): Promise<any>;
  createWebhookSubscription(url: string): Promise<any>;
  getWebhookSubscriptions(): Promise<any>;
  deleteWebhookSubscription(webhookId: string): Promise<any>;
  getEvents(limit: number, offset: number): Promise<any>;
  getEventsSinceDate(date: Date): Promise<any>;
  getEvent(eventId: string): Promise<any>;
  removeFundingSource(fundingSourceId: string): Promise<boolean>;
  getOnDemandAuthorization(): Promise<any>;
  createBeneficialOwnerDocuments({
    beneficialOwnerId,
    file,
    documentType,
  }: BeneficialOwnerDocument): Promise<any>;
  cancelTransaction(transferId: string): Promise<boolean>;
  deleteBeneficialOwner(dwollaBeneficialOwnerId: string): Promise<void>;
}
