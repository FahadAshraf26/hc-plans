import { IDwollaServiceId, IDwollaService } from '@infrastructure/Service/IDwollaService';
import {
  IHoneycombDwollaCustomerRepositoryId,
  IHoneycombDwollaCustomerRepository,
} from '@domain/Core/HoneycombDwollaCustomer/IHoneycombDwollaCustomerRepository';
import HttpError from '@infrastructure/Errors/HttpException';
import PaymentOptionType from '@domain/InvestorPaymentOptions/PaymentOptionType';
import BankAccountType from '@domain/InvestorPaymentOptions/BankAccountType';
import InvestorPaymentOptions from '@domain/InvestorPaymentOptions/InvestorPaymentOptions';
import InvestorBank from '@domain/InvestorPaymentOptions/InvestorBank';
import DeleteInvestorPaymentOptionDTO from '../deleteInvestorPaymentOption/DeleteInvestorPaymentPaymentDTO';
// import InvestorBankMap from '@domain/InvestorPaymentOptions/Mappers/InvestorBankMap';
import { injectable, inject } from 'inversify';
import { IUserRepository, IUserRepositoryId } from '@domain/Core/User/IUserRepository';
import {
  IInvestorPaymentOptionsRepository,
  IInvestorPaymentOptionsRepositoryId,
} from '@domain/InvestorPaymentOptions/IInvestorPaymentOptionsRepository';
import { usaepayService } from '@infrastructure/Service/PaymentProcessor';
import { IAddInvestorBankUseCase } from './IAddInvestorBankUseCase';
import {
  IDeleteInvestorPaymentOptionUseCase,
  IDeleteInvestorPaymentOptionUseCaseId,
} from '../deleteInvestorPaymentOption/IDeleteInvestorPaymentOptionUseCase';
import {
  IPlaidService,
  IPlaidServiceId,
} from '@infrastructure/Service/Plaid/IPlaidService';

@injectable()
class AddInvestorBankUseCase implements IAddInvestorBankUseCase {
  constructor(
    @inject(IUserRepositoryId) private userRepository: IUserRepository,
    @inject(IInvestorPaymentOptionsRepositoryId)
    private investorPaymentOptionRepository: IInvestorPaymentOptionsRepository,
    @inject(IDeleteInvestorPaymentOptionUseCaseId)
    private deleteInvestorPaymentOption: IDeleteInvestorPaymentOptionUseCase,
    @inject(IPlaidServiceId) private plaidService: IPlaidService,
    @inject(IHoneycombDwollaCustomerRepositoryId)
    private honeycombDwollaCustomerRepository: IHoneycombDwollaCustomerRepository,
    @inject(IDwollaServiceId) private dwollaService: IDwollaService,
  ) {}

  async addDwollaBank(user, bank, honeycombCustomer) {
    const investorBank = await this.investorPaymentOptionRepository.fetchInvestorBank(
      user.investor.investorId,
    );
    if (investorBank) {
      const bankObj = investorBank.getBank();
      if (bankObj.getDwollaFundingSourceId() !== null) {
        const getDwollaBank = await this.dwollaService.retrieveFundingSource(
          bankObj.getDwollaFundingSourceId(),
        );

        if (getDwollaBank) {
          await this.dwollaService.removeFundingSource(
            bankObj.getDwollaFundingSourceId(),
          );
        }
      }
    }

    const onDemandAuthorization = await this.dwollaService.getOnDemandAuthorization();
    const authorization = {
      'on-demand-authorization': {
        href: onDemandAuthorization['_links'].self.href,
      },
    };
    const input = {
      _links: authorization,
      routingNumber: bank._props.routingNumber,
      accountNumber: bank._props.accountNumber,
      bankAccountType: bank._props.accountType._value,
      name: bank._props.bankName,
    };
    try {
      const response = await this.dwollaService.addFundingSource(
        honeycombCustomer.getDwollaCustomerId(),
        input,
      );
      return response;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async saveBankAccount(user, addInvestorBankDTO) {
    let bank;
    let paymentOption;
    if (addInvestorBankDTO.getBankDetails().investorBankId) {
      bank = addInvestorBankDTO.getBankDetails();
    } else {
      const bankType = BankAccountType.createFromValue(
        addInvestorBankDTO.getBankDetails().accountType,
      );

      const bankDetails = await this.getBankAccountInfoFromPlaid(addInvestorBankDTO);

      if (bankDetails.accountNumber) {
        bank = InvestorBank.create({
          ...addInvestorBankDTO.getBankDetails(),
          ...bankDetails,
          bankToken: bankDetails.accessToken,
          accountType: bankType,
        });
      }
    }
    const honeycombCustomer = await this.honeycombDwollaCustomerRepository.fetchByCustomerTypeAndUser(
      user.userId,
      'Personal',
    );
    if (honeycombCustomer) {
      const response = await this.addDwollaBank(user, bank, honeycombCustomer);
      bank['_props'].dwollaFundingSourceId = response;
      paymentOption = InvestorPaymentOptions.create({
        investorId: user.investor.investorId,
        type: PaymentOptionType.Bank(),
        bank,
      });
    } else {
      paymentOption = InvestorPaymentOptions.create({
        investorId: user.investor.investorId,
        type: PaymentOptionType.Bank(),
        bank,
      });
    }

    await this.deleteBankAccountIfAlreadyExists(addInvestorBankDTO, user);
    // await northCapitalService.createInvestorExternalAccount({
    //   accountId: user.investor.ncAccountId,
    //   ip: addInvestorBankDTO.getIp(),
    //   investorName: `${user.firstName} ${user.lastName}`,
    //   nickName: `${paymentOption.getBank().getAccountType()} account`,
    //   ...InvestorBankMap.toPersistence(paymentOption.getBank()),
    // });

    if (user.vcCustomerId && user.vcThreadBankCustomerId) {
      const bankInfo = {
        accountNumber: paymentOption.getBank().getAccountNumber(),
        routingNumber: paymentOption.getBank().getRoutingNumber(),
        accountType: paymentOption.getBank().getAccountType(),
      };
      await usaepayService.attachCustomerFirstCitizenBankAccount(
        user.firstName,
        user.lastName,
        bankInfo,
        user.investor.vcCustomerKey,
      );
      await usaepayService.attachCustomerThreadBankAccount(
        user.firstName,
        user.lastName,
        bankInfo,
        user.investor.vcThreadBankCustomerKey,
      );
    }

    await this.investorPaymentOptionRepository.add(paymentOption);
  }

  async getBankAccountInfoFromPlaid(addInvestorBankDTO) {
    const accountId = addInvestorBankDTO.getBankDetails().accountId;
    const accessToken = await this.plaidService.getAccessToken(
      addInvestorBankDTO.getPlaidToken(),
    );
    const { numbers, accounts } = await this.plaidService.getAccounts(accessToken);

    const accountDetails = numbers.ach.find((item) => item.account_id === accountId);
    const account = accounts.find((account) => account.account_id === accountId);

    if (!account || !accountDetails) {
      throw new HttpError(
        400,
        'Something Went Wrong, Try Again Later or Contact Support',
      );
    }

    /**
     * TODO: implement existing bank check here
     */

    return {
      accessToken,
      accountName: account.name,
      routingNumber: accountDetails.routing,
      wireRoutingNumber: accountDetails.wire_routing,
      accountNumber: accountDetails.account,
    };
  }

  async deleteBankAccountIfAlreadyExists(dto, user) {
    const bank: any = await this.investorPaymentOptionRepository.fetchInvestorBank(
      user.investor.investorId,
    );

    if (bank) {
      const deleteDto = DeleteInvestorPaymentOptionDTO.create({
        investorPaymentOptionId: bank.getInvestorPaymentOptionsId(),
        investorId: user.investor.investorId,
        hardDelete: 'false',
        ip: dto.getIp(),
      });

      await this.deleteInvestorPaymentOption.execute(deleteDto);
      // await northCapitalService.removeExternalAccount({
      //   accountId: user.investor.ncAccountId,
      // });
    }
  }

  async execute(addInvestorBankDTO) {
    const userId = addInvestorBankDTO.getUserId();
    const user = await this.userRepository.fetchById(userId);

    if (!user) {
      throw new HttpError(404, 'resource not found');
    }

    const paymentOptionType = addInvestorBankDTO.getPaymentOptionType();
    if (paymentOptionType.getValue() === PaymentOptionType.Card().getValue()) {
    } else if (paymentOptionType.getValue() === PaymentOptionType.Bank().getValue()) {
      await this.saveBankAccount(user, addInvestorBankDTO);
    }

    return true;
  }
}

export default AddInvestorBankUseCase;
