import {
  IIssuerBankRepository,
  IIssuerBankRepositoryId,
} from '@domain/Core/IssuerBank/IIssuerBankRepository';
import { IUserRepositoryId, IUserRepository } from '@domain/Core/User/IUserRepository';
import {
  IHoneycombDwollaCustomerRepositoryId,
  IHoneycombDwollaCustomerRepository,
} from '@domain/Core/HoneycombDwollaCustomer/IHoneycombDwollaCustomerRepository';
import CreateHoneycombDwollaBusinessConsentsDTO from '@application/HoneycombDwollaConsent/CreateHoneycombDwollaBusinesConsentDTO';
import HttpError from '@infrastructure/Errors/HttpException';
import {
  IIssuerRepositoryId,
  IIssuerRepository,
} from '@domain/Core/Issuer/IIssuerRepository';
import { IDwollaServiceId, IDwollaService } from '@infrastructure/Service/IDwollaService';
import {
  IHoneycombDwollaConsentRepository,
  IHoneycombDwollaConsentRepositoryId,
} from '@domain/Core/HoneycombDwollaConsent/IHoneycombDwollaConsentRepository';
import { IHoneycombDwollaConsentService } from './IHoneycombDwollaConsentService';
import HoneycombDwollaConsent from '@domain/Core/HoneycombDwollaConsent/HoneycombDwollaConsent';
import { inject, injectable } from 'inversify';
import { DwollaCustomerTypes } from '@domain/Core/ValueObjects/DwollaCustomerTypes';
import HoneycombDwollaCustomer from '@domain/Core/HoneycombDwollaCustomer/HoneycombDwollaCustomer';
import CreateHoneycombDwollaPersonalConsentDTO from './CreateHoneycombDwollaPersonalConsentDTO';
import HoneycombDwollaBeneficialOwner from '@domain/Core/HoneycombDwollaBeneficialOwner/HoneycombDwollaBeneficialOwner';
import {
  IHoneycombDwollaBeneficialOwnerRepositoryId,
  IHoneycombDwollaBeneficialOwnerRepository,
} from '@domain/Core/HoneycombDwollaBeneficialOwner/IHoneycombDwollaBeneficialOwnerRepository';
import async from 'async';

@injectable()
class HoneycombDwollaConsentService implements IHoneycombDwollaConsentService {
  constructor(
    @inject(IHoneycombDwollaConsentRepositoryId)
    private honeycombDwollaConsentRepository: IHoneycombDwollaConsentRepository,
    @inject(IDwollaServiceId) private dwollaService: IDwollaService,
    @inject(IIssuerRepositoryId) private issuerRepository: IIssuerRepository,
    @inject(IHoneycombDwollaCustomerRepositoryId)
    private honeycombDwollaCustomerRepository: IHoneycombDwollaCustomerRepository,
    @inject(IUserRepositoryId) private userRepository: IUserRepository,
    @inject(IIssuerBankRepositoryId)
    private issuerBankRepository: IIssuerBankRepository,
    @inject(IHoneycombDwollaBeneficialOwnerRepositoryId)
    private honeycombDwollaBeneficialOwnerRepository: IHoneycombDwollaBeneficialOwnerRepository,
  ) {}

  async createBusinessCustomerWithController(
    createHoneycombDwollaBusinessConsentDTO: CreateHoneycombDwollaBusinessConsentsDTO,
  ) {
    const issuerId = createHoneycombDwollaBusinessConsentDTO.getIssuerId();
    const issuer = await this.issuerRepository.fetchById(issuerId);
    const user = await this.userRepository.fetchByEmail(
      createHoneycombDwollaBusinessConsentDTO.getUserEmail(),
      false,
    );

    if (!issuer) {
      throw new Error('No issuer found against provided input');
    }

    if (!user) {
      throw new Error('No user found against provided input');
    }

    const honeycombDwollaConsent = await this.honeycombDwollaConsentRepository.fetchByIssuerId(
      createHoneycombDwollaBusinessConsentDTO.getIssuerId(),
    );

    if (honeycombDwollaConsent !== null) {
      const owner = await this.userRepository.fetchById(user.userId);
      throw new Error(
        `Dwolla Customer for this business is already created by ${owner.firstName} ${owner.lastName}`,
      );
    }

    issuer.setDwollaBusinessClassification(
      createHoneycombDwollaBusinessConsentDTO.getBusinessClassificationId(),
    );

    let ssn = user.ssn;
    const userData = {
      ...user,
      ssn,
    };

    const input = await this.dwollaService.createBusinessInput(issuer, {
      userDetails: userData,
      title: 'CEO',
    });

    const result = await this.honeycombDwollaConsentRepository.fetchByIssuerId(issuerId);

    if (result !== null) {
      throw new HttpError(400, 'No record found against provided input');
    }
    const issuerBanks = await this.issuerBankRepository.fetchAllBanksByIssuerId(issuerId);
    const response: string = await this.dwollaService.createCustomer(input, undefined);
    let consentDate = new Date();
    const honeycombDwollaConsentObject = HoneycombDwollaConsent.createFromDetail(
      consentDate,
    );
    honeycombDwollaConsentObject.setIssuerId(issuerId);
    honeycombDwollaConsentObject.setUserId(user.userId);

    const dwollaBalanceDetail = await this.dwollaService.listFundingSources(response);
    const [dwollaBalance] = dwollaBalanceDetail.filter((item) => item.type === 'balance');
    let dwollaBalanceId = dwollaBalance ? dwollaBalance.id : '';
    const isController =
      issuer.getLegalEntityType() === 'soleProprietorShip' ? false : true;
    const honeycombDwollaCustomer = HoneycombDwollaCustomer.createFromDetail(
      response,
      DwollaCustomerTypes.BUSINESS,
      isController,
      true,
      dwollaBalanceId,
    );
    honeycombDwollaCustomer.setIssuerId(issuerId);
    honeycombDwollaCustomer.setUserId(user.userId);
    await this.honeycombDwollaConsentRepository.createHoneycombDwollaConsent(
      honeycombDwollaConsentObject,
    );

    await this.honeycombDwollaCustomerRepository.createHoneycombDwollaCustomer(
      honeycombDwollaCustomer,
    );

    const onDemandAuthorization = await this.dwollaService.getOnDemandAuthorization();

    const dwollaCustomer = await this.honeycombDwollaCustomerRepository.fetchByIssuerId(
      issuerId,
    );

    if (issuerBanks && dwollaCustomer) {
      async.eachSeries(issuerBanks, async (issuerBank) => {
        const authorization = {
          'on-demand-authorization': {
            href: onDemandAuthorization['_links'].self.href,
          },
        };
        const input = {
          _links: authorization,
          routingNumber: issuerBank.getRoutingNumber(),
          accountNumber: issuerBank.getAccountNumber(),
          bankAccountType: issuerBank.accountType,
          name: issuerBank.accountName,
        };

        let fundingSourceId;

        if (issuerBank.getBankToken() !== null) {
          fundingSourceId = await this.dwollaService.addFundingSource(
            honeycombDwollaCustomer.getDwollaCustomerId(),
            {
              plaidToken: issuerBank.getBankToken(),
              name: `${issuer.issuerName}'s ${issuerBank.getAccountType()}`,
              bankAccountType: issuerBank.getAccountType(),
            },
          );
        } else {
          fundingSourceId = await this.dwollaService.addFundingSource(
            dwollaCustomer.getDwollaCustomerId(),
            input,
          );
        }

        await this.issuerBankRepository.updateIssuerBank({
          ...issuerBank,
          dwollaSourceId: fundingSourceId,
        });

        if (issuerBank.isForRepayment && issuerBank.getBankToken() !== null) {
          await this.dwollaService.makeMicroDeposits(fundingSourceId);
        }
      });
    }
    const beneficialOwner = issuer.owners.filter((item) => item.beneficialOwner === true);
    if (
      beneficialOwner.length > 0 &&
      issuer.getLegalEntityType() !== 'soleProprietorShip'
    ) {
      const businessOwnerUser = await this.userRepository.fetchById(
        beneficialOwner[0].userId,
      );

      const dwollaCustomerObj = await this.honeycombDwollaCustomerRepository.fetchByIssuerId(
        issuer.issuerId,
      );

      if (dwollaCustomerObj === null) {
        throw new Error('Customer not found');
      }

      if (!businessOwnerUser) {
        throw new Error('User not found');
      }

      const beneficialOwnerInput = await this.dwollaService.createBenenficialOwnerInpupt(
        user,
      );

      const businessOwnerResponse = await this.dwollaService.createBeneficialOwner(
        dwollaCustomerObj.getDwollaCustomerId(),
        beneficialOwnerInput,
      );

      const { owner } = user;
      const dwollaBeneficialOwner = HoneycombDwollaBeneficialOwner.createFromDetail(
        businessOwnerResponse,
      );
      dwollaBeneficialOwner.setDwollaCustomerId(dwollaCustomerObj.getDwollaCustomerId());
      dwollaBeneficialOwner.setOwnerId(owner.ownerId);

      await this.honeycombDwollaBeneficialOwnerRepository.createDwollaBeneficialOwner(
        dwollaBeneficialOwner,
      );

      if (businessOwnerResponse) {
        await this.dwollaService.certifyOwner(dwollaCustomerObj.getDwollaCustomerId());
      }
    }
    return;
  }

  async createPersonalCustomer(
    createHoneycombDwollaPersonalConsentDTO: CreateHoneycombDwollaPersonalConsentDTO,
  ) {
    try {
      const userId = createHoneycombDwollaPersonalConsentDTO.getUserId();
      const user = await this.userRepository.fetchById(userId);

      if (!user) {
        throw new HttpError(400, 'User Not Found');
      }

      const input = await this.dwollaService.createCustomerInput(user, false);

      const response: string = await this.dwollaService.createCustomer(input, undefined);
      let consentDate = new Date();
      const honeycombDwollaConsentObject = HoneycombDwollaConsent.createFromDetail(
        consentDate,
      );
      honeycombDwollaConsentObject.setUserId(userId);
      const dwollaBalanceDetail = await this.dwollaService.listFundingSources(response);
      const dwollaBalance = dwollaBalanceDetail.filter((item) => item.type === 'balance');
      const dwollaBalanceId = dwollaBalance.length > 0 ? dwollaBalance[0].id : '';
      const honeycombDwollaCustomer = HoneycombDwollaCustomer.createFromDetail(
        response,
        DwollaCustomerTypes.PERSONAL,
        false,
        false,
        dwollaBalanceId,
      );
      honeycombDwollaCustomer.setUserId(userId);
      await this.honeycombDwollaConsentRepository.createHoneycombDwollaConsent(
        honeycombDwollaConsentObject,
      );

      return this.honeycombDwollaCustomerRepository.createHoneycombDwollaCustomer(
        honeycombDwollaCustomer,
      );
    } catch (err) {
      throw new Error(err);
    }
  }
}

export default HoneycombDwollaConsentService;
