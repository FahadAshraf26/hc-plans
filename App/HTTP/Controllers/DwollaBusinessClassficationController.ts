import GetDwollaBusinessClassificationWithIssuerDTO from '@application/DwollaBusinessClassification/GetDwollaBusinessClassificationWithIssuerDTO';
import {
  IDwollaBusinessClassificationServiceId,
  IDwollaBusinessClassificationService,
} from '@application/DwollaBusinessClassification/IDwollaBusinessClassificationService';
import { inject, injectable } from 'inversify';

@injectable()
class DwollaBusinessClassificationController {
  constructor(
    @inject(IDwollaBusinessClassificationServiceId)
    private dwollaBusinessClassificationService: IDwollaBusinessClassificationService,
  ) {}

  getBusinessClassifications = async (httpRequest) => {
    const { issuerOwnerId, issuerId } = httpRequest.params;
    const input = new GetDwollaBusinessClassificationWithIssuerDTO(
      issuerOwnerId,
      issuerId,
    );
    const response = await this.dwollaBusinessClassificationService.getDwollaBusinessClassification(
      input,
    );
    return {
      body: {
        status: 'success',
        data: response,
      },
    };
  };
}

export default DwollaBusinessClassificationController;
