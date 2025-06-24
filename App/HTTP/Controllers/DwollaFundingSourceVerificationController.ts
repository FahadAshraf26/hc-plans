import {
  IDwollaFundingSourceVerificationServiceId,
  IDwollaFundingSourceVerificationService,
} from '@application/DwollaFundingSourceVerification/IDwollaFundingSourceVerificationService';
import InitiateMicroDepositeDTO from '@application/DwollaFundingSourceVerification/InitiateMicroDepositeDTO';
import VerifyMicroDepositeDTO from '@application/DwollaFundingSourceVerification/VerifyMicroDepositeDTO';
import { injectable, inject } from 'inversify';

@injectable()
class DwollaFundingSourceVerificationController {
  constructor(
    @inject(IDwollaFundingSourceVerificationServiceId)
    private dwollaFundingSourceVerificationService: IDwollaFundingSourceVerificationService,
  ) {}

  initiateDwollaFundingSourceMicroDeposite = async (httpRequest) => {
    const { dwollaSourceId } = httpRequest.params;
    const input = new InitiateMicroDepositeDTO(dwollaSourceId);
    const response = await this.dwollaFundingSourceVerificationService.initiateDwollaFundingSource(
      input,
    );
    return {
      body: {
        status: 'success',
        data: response,
      },
    };
  };

  verifyDwollaFundingSourceMicroDeposite = async (httpRequest) => {
    const { dwollaSourceId } = httpRequest.params;
    const { firstAmount, secondAmount } = httpRequest.body;
    const input = new VerifyMicroDepositeDTO(dwollaSourceId, firstAmount, secondAmount);
    await this.dwollaFundingSourceVerificationService.verifyDwollaFundingSourceMicroDeposite(
      input,
    );
    return {
      body: {
        status: 'success',
        message: 'Dwolla Funding source micro deposit verified',
      },
    };
  };
}

export default DwollaFundingSourceVerificationController;
