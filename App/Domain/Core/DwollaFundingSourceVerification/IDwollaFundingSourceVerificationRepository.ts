import DwollaFundingSourceVerification from '@domain/Core/DwollaFundingSourceVerification/DwollaFundingSourceVerification';
export const IDwollaFundingSourceVerificationRepositoryId = Symbol.for(
  'IDwollaFundingSourceVerificationRepository',
);
export interface IDwollaFundingSourceVerificationRepository {
  addFundingSourceVerification(dwollaFundingSourceVerification): Promise<any>;
  updateFundignSourceVerification(dwollaFundingSourceVerification): Promise<any>;
  fetchByDwollaSourceId(dwollaSourceId: string): Promise<DwollaFundingSourceVerification>;
}
