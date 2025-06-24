import User from '@domain/Core/User/User';
import { IAddPersonalVerifiedCustomer } from './IAddPersonalVerifiedCustomer';
import { IDwollaServiceId, IDwollaService } from '@infrastructure/Service/IDwollaService';
import {
  IInvestorPaymentOptionsRepositoryId,
  IInvestorPaymentOptionsRepository,
} from '@domain/InvestorPaymentOptions/IInvestorPaymentOptionsRepository';
import EncryptionService from '@infrastructure/Service/EncryptionService/EncryptionService';
import { inject, injectable } from 'inversify';
import CreateHoneycombDwollaPersonalConsentDTO from '@application/HoneycombDwollaConsent/CreateHoneycombDwollaPersonalConsentDTO';
import {
  IHoneycombDwollaConsentServiceId,
  IHoneycombDwollaConsentService,
} from '@application/HoneycombDwollaConsent/IHoneycombDwollaConsentService';
import {
  IHoneycombDwollaCustomerRepository,
  IHoneycombDwollaCustomerRepositoryId,
} from '@domain/Core/HoneycombDwollaCustomer/IHoneycombDwollaCustomerRepository';
import {
  IInvestorBankDAOId,
  IInvestorBankDAO,
} from '@domain/InvestorPaymentOptions/IInvestorBankDAO';
import ParseBoolean from '@infrastructure/Utils/ParseBoolean';
import { IUserRepository, IUserRepositoryId } from '@domain/Core/User/IUserRepository';

@injectable()
class AddPersonalVerifiedCustomer implements IAddPersonalVerifiedCustomer {
  constructor(
    @inject(IInvestorPaymentOptionsRepositoryId)
    private investorPaymentOptionRepository: IInvestorPaymentOptionsRepository,
    @inject(IHoneycombDwollaConsentServiceId)
    private dwollaConsentService: IHoneycombDwollaConsentService,
    @inject(IHoneycombDwollaCustomerRepositoryId)
    private honeycombDwollaCustomerRepository: IHoneycombDwollaCustomerRepository,
    @inject(IDwollaServiceId) private dwollaService: IDwollaService,
    @inject(IInvestorBankDAOId) private investorBankDAO: IInvestorBankDAO,
    @inject(IUserRepositoryId) private userRepository: IUserRepository,
  ) {}

  async addInvestorBankToDwolla(bank, customerCreationStatus, dwollaCustomer) {
    let routingNumber = bank.getRoutingNumber();
    let accountNumber = bank.getAccountNumber();
    if (routingNumber.length > 9) {
      routingNumber = EncryptionService.decryptBankDetails(routingNumber);
      accountNumber = EncryptionService.decryptBankDetails(accountNumber);
    }
    if (customerCreationStatus !== null && dwollaCustomer) {
      const onDemandAuthorization = await this.dwollaService.getOnDemandAuthorization();
      const authorization = {
        'on-demand-authorization': {
          href: onDemandAuthorization['_links'].self.href,
        },
      };
      const bankInput = {
        _links: authorization,
        routingNumber,
        accountNumber,
        bankAccountType: bank.getAccountType(),
        name: bank.getBankName(),
      };
      try {
        const dwollaFundingSourceId = await this.dwollaService.addFundingSource(
          dwollaCustomer.getDwollaCustomerId(),
          bankInput,
        );
        bank.setDwollaFundingSourceId(dwollaFundingSourceId);
        bank.setParentId(bank['_props'].investorPaymentOptionsId);
        bank['_props'].dwollaFundingSourceId = dwollaFundingSourceId;
        await this.investorBankDAO.update(bank);
      } catch (err) {}
    }
  }

  async addDwollaPersonalVerifiedCustomer(user) {
    const investorPaymentOption = await this.investorPaymentOptionRepository.fetchInvestorBank(
      user.investor.investorId,
    );

    if (investorPaymentOption) {
      const bank = investorPaymentOption.getBank();

      const input = new CreateHoneycombDwollaPersonalConsentDTO(user.userId);
      try {
        const customerCreationStatus = await this.dwollaConsentService.createPersonalCustomer(
          input,
        );
        const dwollaCustomer = await this.honeycombDwollaCustomerRepository.fetchByUserId(
          user.userId,
        );
        await this.addInvestorBankToDwolla(bank, customerCreationStatus, dwollaCustomer);
        return dwollaCustomer.getDwollaCustomerId();
      } catch (err) {
        throw new Error(err);
      }
    } else {
      try {
        const input = new CreateHoneycombDwollaPersonalConsentDTO(user.userId);
        return this.dwollaConsentService.createPersonalCustomer(input);
      } catch (err) {
        throw new Error(err);
      }
    }
  }

  async execute(payload, user: User) {
    const dwollaCustomerId = await this.addDwollaPersonalVerifiedCustomer(user);
    if (dwollaCustomerId) {
      user.setTos(ParseBoolean(payload.tos));
      await this.userRepository.update(user);
    }
  }
}

export default AddPersonalVerifiedCustomer;
