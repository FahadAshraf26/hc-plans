import { IDwollaServiceId, IDwollaService } from '@infrastructure/Service/IDwollaService';
import { inject, injectable } from 'inversify';
import DwollaFundingSourceVerification from '@domain/Core/DwollaFundingSourceVerification/DwollaFundingSourceVerification';
import {
  IDwollaFundingSourceVerificationRepository,
  IDwollaFundingSourceVerificationRepositoryId,
} from '@domain/Core/DwollaFundingSourceVerification/IDwollaFundingSourceVerificationRepository';
import { IDwollaFundingSourceVerificationService } from './IDwollaFundingSourceVerificationService';
import InitiateMicroDepositeDTO from './InitiateMicroDepositeDTO';
import VerifyMicroDepositeDTO from './VerifyMicroDepositeDTO';

@injectable()
class DwollaFundingSourceVerificationService
  implements IDwollaFundingSourceVerificationService {
  constructor(
    @inject(IDwollaFundingSourceVerificationRepositoryId)
    private dwollaFundingSourceVerificationRepository: IDwollaFundingSourceVerificationRepository,
    @inject(IDwollaServiceId) private dwollaService: IDwollaService,
  ) {}

  async initiateDwollaFundingSource(initialMicroDepositeDTO: InitiateMicroDepositeDTO) {
    const dwollaSourceId = initialMicroDepositeDTO.getDwollaSourceId();
    const dwollaFundingSourceVerification = await this.dwollaFundingSourceVerificationRepository.fetchByDwollaSourceId(
      dwollaSourceId,
    );

    if (dwollaFundingSourceVerification !== null) {
      throw new Error('Dwolla Funding Source Micro Deposite already initiated');
    }

    const dwollaFundingSourceVerificationObj = DwollaFundingSourceVerification.createFromDetails(
      true,
      new Date(),
      null,
      null,
      null,
    );
    dwollaFundingSourceVerificationObj.setDwollaSourceId(dwollaSourceId);
    const response = await this.dwollaService.makeMicroDeposits(dwollaSourceId);
    if (response.status === '201') {
      await this.dwollaFundingSourceVerificationRepository.addFundingSourceVerification(
        dwollaFundingSourceVerificationObj,
      );
    }

    return response;
  }

  async verifyDwollaFundingSourceMicroDeposite(
    verifyMicroDepositeDTO: VerifyMicroDepositeDTO,
  ) {
    const dwollaSourceId = verifyMicroDepositeDTO.getDwollaSourceId();
    const firstAmount = verifyMicroDepositeDTO.getFirstAmount();
    const secondAmount = verifyMicroDepositeDTO.getSecondAmount();
    // const dwollaFundingSourceVerification = await this.dwollaFundingSourceVerificationRepository.fetchByDwollaSourceId(
    //   dwollaSourceId,
    // );

    // if (dwollaFundingSourceVerification === null) {
    //   throw new Error('No Dwolla Funding Source micro deposit found');
    // }
    // const verificationObj = {
    //   ...dwollaFundingSourceVerification,
    //   firstTransactionAmount: firstAmount,
    //   secondTransactionAmount: secondAmount,
    // };
    // const dwollaFundingSourceVerificationObj = DwollaFundingSourceVerification.createFromObject(
    //   verificationObj,
    // );

    return this.dwollaService.verifyFundingSource({
      fundingSourceId: dwollaSourceId,
      firstTransactionAmount: firstAmount,
      secondTransactionAmount: secondAmount,
    });

    // return this.dwollaFundingSourceVerificationRepository.updateFundignSourceVerification(
    //   dwollaFundingSourceVerificationObj,
    // );
  }
}

export default DwollaFundingSourceVerificationService;
