import {
  IHoneycombDwollaCustomerRepository,
  IHoneycombDwollaCustomerRepositoryId,
} from '@domain/Core/HoneycombDwollaCustomer/IHoneycombDwollaCustomerRepository';
import HttpException from '@infrastructure/Errors/HttpException';
import {
  IPlaidService,
  IPlaidServiceId,
} from '@infrastructure/Service/Plaid/IPlaidService';
import IssuerBank from '@domain/Core/IssuerBank/IssuerBank';
import { IIssuerBankService } from '@application/IssuerBank/IIssuerBankService';
import { inject, injectable } from 'inversify';
import {
  IIssuerBankRepository,
  IIssuerBankRepositoryId,
} from '@domain/Core/IssuerBank/IIssuerBankRepository';
import {
  IIssuerRepository,
  IIssuerRepositoryId,
} from '@domain/Core/Issuer/IIssuerRepository';
import Issuer from '@domain/Core/Issuer/Issuer';
import { IDwollaService, IDwollaServiceId } from '@infrastructure/Service/IDwollaService';
import AddIssuerBankWithAuthorizationDTO from './AddIssuerBankWithAuthorizationDTO';
import UpdateIssuerBankDTO from './UpdateIssuerBankDTO';
import { IDwollaWebhookDAO, IDwollaWebhookDAOId } from '@domain/Core/IDwollaWebhookDAO';
@injectable()
class IssuerBankService implements IIssuerBankService {
  constructor(
    @inject(IIssuerBankRepositoryId) private issuerBankRepository: IIssuerBankRepository,
    @inject(IIssuerRepositoryId) private issuerRepository: IIssuerRepository,
    @inject(IPlaidServiceId) private plaidService: IPlaidService,
    @inject(IDwollaServiceId) private dwollaService: IDwollaService,
    @inject(IHoneycombDwollaCustomerRepositoryId)
    private honeycombDwollaCustomerRepository: IHoneycombDwollaCustomerRepository,
    @inject(IDwollaWebhookDAOId) private dwollaWebhook: IDwollaWebhookDAO,
  ) {}
  async addBank(addIssuerBankDTO) {
    const issuer: Issuer = await this.issuerRepository.fetchById(
      addIssuerBankDTO.getIssuerId(),
    );

    if (!issuer) {
      throw new HttpException(400, 'no issuer found against the provided input');
    }

    const { issuerName }: any = issuer;

    const accessToken = await this.plaidService.getAccessToken(
      addIssuerBankDTO.getPublicToken(),
    );

    const bankToken = await this.plaidService.getDwollaToken(
      addIssuerBankDTO.getAccountId(),
      accessToken,
    );

    const { numbers, accounts } = await this.plaidService.getAccounts(accessToken);
    const accountDetails = numbers.ach.find(
      (item) => item.account_id === addIssuerBankDTO.getAccountId(),
    );
    const account: any = accounts.find(
      (account) => account.account_id === addIssuerBankDTO.getAccountId(),
    );

    if (!account || !accountDetails) {
      throw new HttpException(
        400,
        'Something Went Wrong, Try Again Later or Contact Support',
      );
    }

    const honeycombDwollaCustomer = await this.honeycombDwollaCustomerRepository.fetchByIssuerId(
      addIssuerBankDTO.getIssuerId(),
    );
    let fundingSourceId;
    if (honeycombDwollaCustomer !== null) {
      fundingSourceId = await this.dwollaService.addFundingSource(honeycombDwollaCustomer.getDwollaCustomerId(), {
        plaidToken: bankToken,
        name: `${issuerName}'s ${addIssuerBankDTO.getAccountType()}`,
        bankAccountType: addIssuerBankDTO.getAccountType() || account.subType,
      });
    }

    const preferredIssuerBank = await this.issuerBankRepository.fetchOneByCustomCritera({
      whereConditions: {
        issuerId: addIssuerBankDTO.getIssuerId(),
        isForRepayment: true,
      },
    });

    if (preferredIssuerBank) {
      const updatePreviousPreferredBank = {
        ...preferredIssuerBank,
        isForRepayment: false,
      };

      await this.issuerBankRepository.update(updatePreviousPreferredBank, {
        issuerBankId: preferredIssuerBank.issuerBankId,
      });
    }
    
    // accountDetails.account,
    // accountDetails.routing,
    const issuerAccount = IssuerBank.createFromDetail(
      issuer.issuerId,
      addIssuerBankDTO.getAccountType() || account.subType,
      account.name,
      accountDetails.account.substr(accountDetails.account.length - 4, 4),
      true,
      issuerName
    );
    issuerAccount.setAccountNumber(accountDetails.account);
    issuerAccount.setRoutingNumber(accountDetails.routing);
    issuerAccount.setBank(fundingSourceId);
    issuerAccount.setBankToken(bankToken);
    issuerAccount.setWireRoutingNumber(accountDetails.wire_routing);

    const addResult = await this.issuerBankRepository.add(issuerAccount);

    if (!addResult) {
      throw new HttpException(400, 'Add Bank Account to Issuer Failed');
    }

    return addResult;
  }

  async getBanks(getIssuerBanksDTO) {
    const Issuer = await this.issuerRepository.fetchById(getIssuerBanksDTO.getIssuerId());

    if (!Issuer) {
      throw new HttpException(400, 'no issuer found against the provided input');
    }

    const result = await this.issuerBankRepository.fetchByIssuerId({
      issuerId: getIssuerBanksDTO.getIssuerId(),
      paginationOptions: getIssuerBanksDTO.getPaginationOptions(),
      showTrashed: getIssuerBanksDTO.isShowTrashed(),
      includeWallet: getIssuerBanksDTO.isIncludeWallet(),
    });

    const response = result.getPaginatedData();

    const promises = response.data.map((issuerBank) => {
      if (issuerBank.dwollaSourceId && !issuerBank.deletedAt) {
        return this.dwollaService.retrieveFundingSource(issuerBank.dwollaSourceId);
      }
      return null;
    });
    const temp = await Promise.all(promises);

    response.data = response.data.map((issuerBank, index): any => {
      return {
        ...issuerBank,
        bank: temp[index],
      };
    });

    return response;
  }

  async removeBank(removeIssuerBankDTO) {
    const issuer = await this.issuerRepository.fetchById(
      removeIssuerBankDTO.getIssuerId(),
    );

    if (!issuer) {
      throw new HttpException(400, 'no issuer found against the provided input');
    }

    const issuerBank = await this.issuerBankRepository.fetchById(
      removeIssuerBankDTO.getIssuerBankId(),
    );

    if (!issuerBank) {
      throw new HttpException(400, 'no issuer bank found against the provided input');
    }

    const isDeleted = await this.dwollaService.removeFundingSource(
      issuerBank.dwollaSourceId,
    );

    if (!isDeleted) {
      throw new HttpException(400, 'delete issuer bank failed');
    }

    const deleteResult = await this.issuerBankRepository.remove(issuerBank);

    if (!deleteResult) {
      throw new HttpException(400, 'DatabaseError: delete issuer bank failed');
    }

    return deleteResult;
  }

  async addIssuerBankWithAuthorization(
    addIssuerBankWithAuthorizationDTO: AddIssuerBankWithAuthorizationDTO,
  ): Promise<boolean> {
    try {
      const issuerId = addIssuerBankWithAuthorizationDTO.getIssuerId();
      const issuer = await this.issuerRepository.fetchById(issuerId);
      const honeycombDwollaCustomer = await this.honeycombDwollaCustomerRepository.fetchByIssuerId(
        issuerId,
      );

      if (!issuer) {
        throw new HttpException(400, 'no issuer found against the provided input');
      }
      let response;
      if (honeycombDwollaCustomer !== null) {
        const onDemandAuthorization = await this.dwollaService.getOnDemandAuthorization();
        const authorization = {
          'on-demand-authorization': {
            href: onDemandAuthorization['_links'].self.href,
          },
        };
        const input = {
          _links: authorization,
          routingNumber: addIssuerBankWithAuthorizationDTO.getRoutingNumber(),
          accountNumber: addIssuerBankWithAuthorizationDTO.getAccountNumber(),
          bankAccountType: addIssuerBankWithAuthorizationDTO.getAccountType(),
          name: addIssuerBankWithAuthorizationDTO.getAccountName(),
        };

        response = await this.dwollaService.addFundingSource(
          honeycombDwollaCustomer.getDwollaCustomerId(),
          input,
        );
      }
      
      const issuerBank = IssuerBank.createFromDetail(
        issuerId,
        addIssuerBankWithAuthorizationDTO.getAccountType(),
        addIssuerBankWithAuthorizationDTO.getAccountName(),
        addIssuerBankWithAuthorizationDTO
          .getAccountNumber()
          .substr(addIssuerBankWithAuthorizationDTO.getAccountNumber().length - 4, 4),
        false,
        addIssuerBankWithAuthorizationDTO.getAccountOwner(),
      );
      issuerBank.setAccountNumber(addIssuerBankWithAuthorizationDTO.getAccountNumber());
      issuerBank.setRoutingNumber(addIssuerBankWithAuthorizationDTO.getRoutingNumber());
      issuerBank.setBank(response);
      await this.issuerBankRepository.add(issuerBank);

      return true;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async updateBank(updateIssuerBankDTO: UpdateIssuerBankDTO): Promise<boolean> {
    const preferredIssuerBank = await this.issuerBankRepository.fetchOneByCustomCritera({
      whereConditions: {
        issuerId: updateIssuerBankDTO.getIssuerId(),
        isForRepayment: true,
      },
    });

    if (preferredIssuerBank) {
      const updatePreviousPreferredBank = {
        ...preferredIssuerBank,
        isForRepayment: false,
      };

      await this.issuerBankRepository.update(updatePreviousPreferredBank, {
        issuerBankId: preferredIssuerBank.issuerBankId,
      });
    }
    const issuerBank = updateIssuerBankDTO.getIssuerBank();
    const issuerBankId = updateIssuerBankDTO.getIssuerBankId();
    const issuerBankDetail = await this.issuerBankRepository.fetchById(issuerBankId);
    const updateIssuerBankDetail = {
      ...issuerBankDetail,
      isForRepayment: issuerBank.isForRepayment,
    };

    await this.issuerBankRepository.update(updateIssuerBankDetail, { issuerBankId });
    const updatedIssuerBank = await this.issuerBankRepository.fetchById(
      issuerBank.getIssuerBankId(),
    );

    if (
      issuerBank.isForRepayment &&
      issuerBank.dwollaSourceId &&
      issuerBank.dwollaSourceId !== null &&
      issuerBank.getBankToken() === null
    ) {
      const response = await this.dwollaWebhook.fetchByResourceId(
        updatedIssuerBank.dwollaSourceId,
      );
      if (response.getStatus() !== 'verified') {
        await this.dwollaService.makeMicroDeposits(updatedIssuerBank.dwollaSourceId);
      }
    }

    return true;
  }
}

export default IssuerBankService;