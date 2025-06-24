import InitiateMicroDepositeDTO from './InitiateMicroDepositeDTO';
import VerifyMicroDepositeDTO from './VerifyMicroDepositeDTO';

export const IDwollaFundingSourceVerificationServiceId = Symbol.for(
  'IDwollaFundingSourceVerificationService',
);

export interface IDwollaFundingSourceVerificationService {
  initiateDwollaFundingSource(
    intiateMicroDepositeDTO: InitiateMicroDepositeDTO,
  ): Promise<any>;

  verifyDwollaFundingSourceMicroDeposite(
    verifyMicroDepositeDTO: VerifyMicroDepositeDTO,
  ): Promise<any>;
}
