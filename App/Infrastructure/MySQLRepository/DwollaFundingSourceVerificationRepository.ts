import DwollaFundingSourceVerification from '@domain/Core/DwollaFundingSourceVerification/DwollaFundingSourceVerification';
import { IDwollaFundingSourceVerificationRepository } from '@domain/Core/DwollaFundingSourceVerification/IDwollaFundingSourceVerificationRepository';
import Model from '@infrastructure/Model';
import { injectable } from 'inversify';

const { DwollaFundingSourceVerificationModel } = Model;

@injectable()
class DwollaFundingSourceVerificationRepository
  implements IDwollaFundingSourceVerificationRepository {
  constructor() {}

  async addFundingSourceVerification(dwollaFundingSourceVerificationObj) {
    await DwollaFundingSourceVerificationModel.create(dwollaFundingSourceVerificationObj);
  }

  async updateFundignSourceVerification(dwollaFundingSourceVerificationObj) {
    await DwollaFundingSourceVerificationModel.update(
      dwollaFundingSourceVerificationObj,
      {
        where: {
          dwollaFundingSourceVerificationId:
            dwollaFundingSourceVerificationObj.dwollaFundingSourceVerificationId,
        },
      },
    );
  }

  async fetchByDwollaSourceId(dwollaSourceId: string) {
    const dwollaFundingSourceVerification = await DwollaFundingSourceVerificationModel.findOne(
      { where: { dwollaSourceId } },
    );

    if (!dwollaFundingSourceVerification) {
      return null;
    }

    return DwollaFundingSourceVerification.createFromObject(
      dwollaFundingSourceVerification,
    );
  }
}

export default DwollaFundingSourceVerificationRepository;
