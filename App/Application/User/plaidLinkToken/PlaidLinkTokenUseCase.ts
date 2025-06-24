import { inject, injectable } from 'inversify';
import {
  IPlaidService,
  IPlaidServiceId,
} from '@infrastructure/Service/Plaid/IPlaidService';
import {
  IInvestorPaymentOptionsRepository,
  IInvestorPaymentOptionsRepositoryId,
} from '@domain/InvestorPaymentOptions/IInvestorPaymentOptionsRepository';
import { IPlaidLinkTokenUseCase } from '@application/User/plaidLinkToken/IPlaidLinkTokenUseCase';

@injectable()
class PlaidLinkTokenUseCase implements IPlaidLinkTokenUseCase {
  constructor(
    @inject(IPlaidServiceId) private plaidService: IPlaidService,
    @inject(IInvestorPaymentOptionsRepositoryId)
    private investorPaymentOptionsRepository: IInvestorPaymentOptionsRepository,
  ) {
    this.plaidService = plaidService;
    this.investorPaymentOptionsRepository = investorPaymentOptionsRepository;
  }

  async updateModeToken(userId, investorId, redirect_uri, android_package_name) {
    const investorBank = await this.investorPaymentOptionsRepository.fetchInvestorBank(
      investorId,
    );

    if (!investorBank) {
      return this.plaidService.createPlaidLinkToken(userId, redirect_uri, android_package_name);
    }

    return this.plaidService.createUpdateModeToken(
      userId,
      investorBank.getBank().getToken(),
      redirect_uri,
      android_package_name,
    );
  }

  async execute(dto) {
    if (dto.isUpdateMode()) {
      return this.updateModeToken(dto.UserId(), dto.InvestorId(), dto.redirectUri(), dto.androidPackageName());
    }
      return this.plaidService.createPlaidLinkToken(dto.UserId(), dto.redirectUri(), dto.androidPackageName());
  }
}

export default PlaidLinkTokenUseCase;
