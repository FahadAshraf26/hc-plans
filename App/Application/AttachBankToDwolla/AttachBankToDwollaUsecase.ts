import { IDwollaServiceId, IDwollaService } from '@infrastructure/Service/IDwollaService';
import { IUserRepositoryId, IUserRepository } from '@domain/Core/User/IUserRepository';
import {
  IHoneycombDwollaCustomerRepositoryId,
  IHoneycombDwollaCustomerRepository,
} from '@domain/Core/HoneycombDwollaCustomer/IHoneycombDwollaCustomerRepository';
import {
  IInvestorPaymentOptionsRepositoryId,
  IInvestorPaymentOptionsRepository,
} from '@domain/InvestorPaymentOptions/IInvestorPaymentOptionsRepository';
import { inject, injectable } from 'inversify';
import { IAttachBankToDwollaUsecase } from './IAttachBankToDwollaUsecase';

@injectable()
class AttachBankToDwollaUsecase implements IAttachBankToDwollaUsecase {
  constructor(
    @inject(IInvestorPaymentOptionsRepositoryId)
    private investorPaymentOptionRepository: IInvestorPaymentOptionsRepository,
    @inject(IHoneycombDwollaCustomerRepositoryId)
    private dwollaCustomerRepository: IHoneycombDwollaCustomerRepository,
    @inject(IUserRepositoryId) private userRepository: IUserRepository,
    @inject(IDwollaServiceId) private dwollaService: IDwollaService,
  ) {}

  async addDwollaBank(user, honeycombCustomer) {
    const investorBank = await this.investorPaymentOptionRepository.fetchInvestorBank(
      user.investor.investorId,
    );
    if (investorBank) {
      const bank = investorBank.getBank();
      const onDemandAuthorization = await this.dwollaService.getOnDemandAuthorization();
      const authorization = {
        'on-demand-authorization': {
          href: onDemandAuthorization['_links'].self.href,
        },
      };
      const input = {
        _links: authorization,
        routingNumber: bank.getRoutingNumber(),
        accountNumber: bank.getAccountNumber(),
        bankAccountType: bank.getAccountType(),
        name: bank.getBankName(),
      };
      try {
        const response = await this.dwollaService.addFundingSource(
          honeycombCustomer.getDwollaCustomerId(),
          input,
        );
        return response;
      } catch (err) {}
    }
  }

  async execute(userId: string): Promise<any> {
    const dwollaCustomer = await this.dwollaCustomerRepository.fetchByUserId(userId);
    if (dwollaCustomer) {
      const user = await this.userRepository.fetchById(userId);
      await this.addDwollaBank(user, dwollaCustomer);
    }
  }
}

export default AttachBankToDwollaUsecase;
