import {
  IHoneycombDwollaBeneficialOwnerRepository,
  IHoneycombDwollaBeneficialOwnerRepositoryId,
} from '@domain/Core/HoneycombDwollaBeneficialOwner/IHoneycombDwollaBeneficialOwnerRepository';
import { IUserRepositoryId, IUserRepository } from '@domain/Core/User/IUserRepository';
import { IDwollaServiceId, IDwollaService } from '@infrastructure/Service/IDwollaService';
import { IDwollaWebhookDAOId, IDwollaWebhookDAO } from '@domain/Core/IDwollaWebhookDAO';
import {
  IHoneycombDwollaCustomerRepositoryId,
  IHoneycombDwollaCustomerRepository,
} from '@domain/Core/HoneycombDwollaCustomer/IHoneycombDwollaCustomerRepository';
import GetAllIssuersDTO from '@application/Issuer/GetAllIssuersDTO';
import GetAllIssuersByOwnerDTO from '@application/Issuer/GetAllIssuersByOwnerDTO';
import GetOneIssuerDTO from '@application/Issuer/GetOneIssuerDTO';
import UpdateIssuerDTO from '@application/Issuer/UpdateIssuerDTO';
import DeleteIssuerDTO from '@application/Issuer/DeleteIssuerDTO';
import GetIssuerInfoDTO from '@application/Issuer/GetIssuerInfoDTO';
import { inject, injectable } from 'inversify';
import {
  IIssuerRepository,
  IIssuerRepositoryId,
} from '@domain/Core/Issuer/IIssuerRepository';
import { IIssuerService } from '@application/Issuer/IIssuerService';
import HttpException from '@infrastructure/Errors/HttpException';
import { CampaignStage } from '@domain/Core/ValueObjects/CampaignStage';
import { IOwnerDao, IOwnerDaoId } from '@domain/Core/Owner/IOwnerDao';
import RetryBusinessDwollaDTO from './RetryDwollaBusinessDTO';

@injectable()
class IssuerService implements IIssuerService {
  constructor(
    @inject(IIssuerRepositoryId) private issuerRepository: IIssuerRepository,
    @inject(IOwnerDaoId) private ownerDAO: IOwnerDao,
    @inject(IHoneycombDwollaCustomerRepositoryId)
    private dwollaCustomerRepository: IHoneycombDwollaCustomerRepository,
    @inject(IDwollaWebhookDAOId) private dwollaWebhook: IDwollaWebhookDAO,
    @inject(IDwollaServiceId) private dwollaService: IDwollaService,
    @inject(IUserRepositoryId) private userRepository: IUserRepository,
    @inject(IHoneycombDwollaBeneficialOwnerRepositoryId)
    private dwollaBeneficialOwnerRepository: IHoneycombDwollaBeneficialOwnerRepository,
  ) {}
  /**
   *
   * @param {GetAllIssuersDTO} getAllIssuersDTO
   */
  async getAllIssuers(getAllIssuersDTO: GetAllIssuersDTO) {
    const result = await this.issuerRepository.fetchAll({
      paginationOptions: getAllIssuersDTO.getPaginationOptions(),
      options: {
        showTrashed: getAllIssuersDTO.isShowTrashed(),
        query: getAllIssuersDTO.getQuery(),
      },
    });
    const response = result.getPaginatedData();
    response.data.forEach((issuer) => {
      if (issuer.campaigns) {
        issuer.campaignDetails = issuer.campaigns.map((obj: any) => {
          return {
            campaignStatus: obj.campaignStage,
            campaignId: obj.campaignId,
            activeCampaign:
              obj.campaignStage === CampaignStage.FUNDRAISING ? 'Yes' : 'No',
            campaignName: obj.campaignName,
          };
        });
        delete issuer.campaigns;
      }
    });
    return response;
  }

  /**
   *
   * @param {GetAllIssuersByOwnerDTO} getAllIssuersByOwnerDTO
   */
  async getAllIssuersByOwner(getAllIssuersByOwnerDTO: GetAllIssuersByOwnerDTO) {
    const result = await this.issuerRepository.fetchAllByOwner(
      getAllIssuersByOwnerDTO.getOwnerId(),
      getAllIssuersByOwnerDTO.getPaginationOptions(),
      getAllIssuersByOwnerDTO.isShowTrashed(),
    );

    return result.getPaginatedData();
  }

  /**
   *
   * @param {GetOneIssuerDTO} getOneIssuerDTO
   */
  async findIssuer(getOneIssuerDTO: GetOneIssuerDTO) {
    const issuer = await this.issuerRepository.fetchById(getOneIssuerDTO.getIssuerId());

    if (!issuer) {
      throw new HttpException(404, 'no issuer found against the provided input');
    }

    return issuer;
  }

  /**
   *
   * @param {UpdateIssuerDTO} updateIssuerDTO
   */
  async updateIssuer(updateIssuerDTO: UpdateIssuerDTO) {
    const IssuerObj = await this.issuerRepository.fetchById(
      updateIssuerDTO.getIssuerId(),
    );

    if (!IssuerObj) {
      throw new HttpException(400, 'no issuer found with provided input');
    }
    const dwollaCustomer = await this.dwollaCustomerRepository.fetchByIssuerId(
      IssuerObj.issuerId,
    );

    const ownerIds = updateIssuerDTO.getOwnerIds();
    const ownerOps = ownerIds.map((ownerId) => this.ownerDAO.fetchById(ownerId));
    const owners = await Promise.all(ownerOps);
    const issuer = updateIssuerDTO.getIssuer();

    const latestUpdatedAt = owners.reduce((latest, owner) => {
      const ownerDate = new Date(owner.updatedAt).getTime();
      return ownerDate > latest ? ownerDate : latest;
    }, 0);
    const baseTime = new Date(latestUpdatedAt);
    const ownerUpdateOps = owners.map((owner, index) => {
      const updatedTime = new Date(baseTime.getTime() + (index * 1000));
      const ownerData = {
        ...owner,
        updatedAt: updatedTime
      };
      return this.ownerDAO.update(ownerData);
    });

    await Promise.all(ownerUpdateOps);
    owners.forEach((owner) => issuer.setOwner(owner));

    const updateResult = await this.issuerRepository.update(issuer);

    if (!updateResult) {
      throw new HttpException(400, 'Issuer update failed');
    }
    await this.updateDwollaCustomer(dwollaCustomer.getDwollaCustomerId());
    return updateResult;
  }

  /**
   *
   * @param {DeleteIssuerDTO} deleteIssuerDTO
   */
  async removeIssuer(deleteIssuerDTO: DeleteIssuerDTO) {
    const issuer = await this.issuerRepository.fetchById(deleteIssuerDTO.getIssuerId());

    if (!issuer) {
      throw new HttpException(404, 'no issuer found against the provided input');
    }

    const deleteResult = await this.issuerRepository.remove(
      issuer,
      deleteIssuerDTO.shouldHardDelete(),
    );

    if (!deleteResult) {
      throw new HttpException(400, 'issuer remove failed');
    }

    return deleteResult;
  }

  /**
   *
   * @param {GetIssuerInfoDTO} getIssuerInfoDTO
   */
  async getIssuerInfo(getIssuerInfoDTO: GetIssuerInfoDTO) {
    const issuer = await this.issuerRepository.fetchIssuerInfoById(
      getIssuerInfoDTO.getIssuerId(),
    );

    if (!issuer) {
      throw new HttpException(404, 'no issuer found against the provided input');
    }
    const issuerDwollaCustomer = await this.dwollaCustomerRepository.fetchByIssuerId(
      issuer.issuerId,
    );

    let dwollaWebhook;
    let status = 'Business Opt-in Required';
    if (issuerDwollaCustomer !== null && issuerDwollaCustomer.getDwollaCustomerId()) {
      issuer.setDwollaCustomerId(issuerDwollaCustomer.getDwollaCustomerId());
      dwollaWebhook = await this.dwollaService.getCustomer(
        issuerDwollaCustomer.getDwollaCustomerId(),
      );
      if (!dwollaWebhook) {
        issuer.setDwollaStatus(status);
      } else {
        issuer.setDwollaStatus(dwollaWebhook.status);
      }
    }

    if (issuer.campaigns) {
      issuer.campaignDetails = issuer.campaigns.map((obj) => {
        return {
          campaignStatus: obj.campaignStage,
          campaignId: obj.campaignId,
          campaignName: obj.campaignName,
          badActorCheck:
            obj.badActorInfoIdentityAtTimeOfOnboarding === true ? 'Fail' : 'Pass',
        };
      });

      delete issuer.campaigns;
    }

    return issuer;
  }

  async retryDwollaBusiness(retryBusinessDwollaDTO: RetryBusinessDwollaDTO) {
    const customerId = retryBusinessDwollaDTO.getCustomerId();
    const dwollaCustomerDetail = await this.dwollaCustomerRepository.fetchByDwollaCustomerId(
      customerId,
    );
    const dwollaBeneficialOwner = await this.dwollaBeneficialOwnerRepository.fetchByDwollaCustomerId(
      customerId,
    );
    const dwollaBusinessCustomer = await this.dwollaService.getCustomer(customerId);
    if (dwollaCustomerDetail) {
      const issuer = await this.issuerRepository.fetchById(
        dwollaCustomerDetail.getIssuerId(),
      );
      const user = await this.userRepository.fetchById(dwollaCustomerDetail.getUserId());
      if (!issuer) {
        throw new Error('No issuer found against provided input');
      }

      if (!user) {
        throw new Error('No user found against provided input');
      }

      let ssn = user.ssn;
      const userData = {
        ...user,
        ssn,
      };

      const input = await this.dwollaService.createBusinessInput(issuer, {
        userDetails: userData,
        title: 'CEO',
      });
      const newInput = {
        ...input,
        businessClassification: dwollaBusinessCustomer
          ? dwollaBusinessCustomer.businessClassification
          : null,
      };

      await this.dwollaService.updateCustomer(customerId, newInput);
      if (issuer.getLegalEntityType() !== 'soleProprietorShip') {
        const beneficialOwnerInput = await this.dwollaService.createBenenficialOwnerInpupt(
          user,
        );
        await this.dwollaService.updateBeneficialOwner(
          dwollaBeneficialOwner.getDwollaBeneficialOwnerId(),
          beneficialOwnerInput,
        );
      }

      const dwollaBalanceDetail = await this.dwollaService.listFundingSources(customerId);
      const [dwollaBalance] = dwollaBalanceDetail.filter(
        (item) => item.type === 'balance',
      );
      let dwollaBalanceId = dwollaBalance ? dwollaBalance.id : '';
      dwollaCustomerDetail.setDwollaBalanceId(dwollaBalanceId);

      await this.dwollaCustomerRepository.updateByIssuer(dwollaCustomerDetail);
    }
    const businessCustomer = await this.dwollaService.getCustomer(customerId);

    return {
      status:
        businessCustomer.status === 'document'
          ? 'error'
          : businessCustomer.status === 'suspended'
          ? 'error'
          : 'success',
      message:
        businessCustomer.status === 'document'
          ? 'Retry Failed need documents for verification '
          : businessCustomer.status === 'suspended'
          ? 'Your Business customer has been suspended'
          : 'Retry initiated successfully',
    };
  }

  async updateDwollaCustomer(customerId) {
    const dwollaCustomerDetail = await this.dwollaCustomerRepository.fetchByDwollaCustomerId(
      customerId,
    );
    if (dwollaCustomerDetail) {
      const issuer = await this.issuerRepository.fetchById(
        dwollaCustomerDetail.getIssuerId(),
      );
      if (!issuer) {
        throw new Error('No issuer found against provided input');
      }

      const input = {
        email: issuer.getEmail(),
        address1: issuer.getAddress(),
        address2: null,
        city: issuer.getCity(),
        state: issuer.getState(),
        postalCode: issuer.getZipCode(),
        phone: issuer.getPhoneNumber(),
      };

      await this.dwollaService.updateCustomer(customerId, input);
    }
  }

  async updateDwollaBusinessCustomer(customerId, input) {
    // const dwollaCustomerDetail = await this.dwollaCustomerRepository.fetchByDwollaCustomerId(
    //   customerId,
    // );

    // if (dwollaCustomerDetail) {
    //   const issuer = await this.issuerRepository.fetchById(
    //     dwollaCustomerDetail.getIssuerId(),
    //   );

    //   if (!issuer) {
    //     throw new Error('No issuer found against provided input');
    //   }
    //   // const dwollaBusinessClassification = await this.dwollaService.getBusinessClassifications();
    //   const user = await this.userRepository.fetchByEmail(
    //     issuer.owners[0].user.email,
    //     false,
    //   );
    //   issuer['dwollaBusinessClassification'] = '9ed3f673-7d6f-11e3-adb1-5404a6144203';

    //   const input = await this.dwollaService.createBusinessInput(issuer, {
    //     userDetails: user,
    //     title: 'CEO',
    //   });

    //   await this.dwollaService.updateCustomer(customerId, input);
    // }
    await this.dwollaService.updateCustomer(customerId, input);
  }

  async updateBusinessCustomerDwollaBalanceId(customerId, dwollaBalanceId) {
    const dwollaBusinessCustomer = await this.dwollaCustomerRepository.fetchByDwollaCustomerId(
      customerId,
    );

    if (!dwollaBusinessCustomer) {
      throw new Error('No customer found against provided input');
    }

    return await this.dwollaCustomerRepository.updateBusinessCustomerDwollaBalanceId(
      customerId,
      dwollaBalanceId,
    );
  }

  async getDwollaBeneficialOwner(dwollaCustomerId) {
    const dwollaBusinessCustomer = this.dwollaBeneficialOwnerRepository.fetchByDwollaCustomerId(
      dwollaCustomerId,
    );
    if (!dwollaBusinessCustomer) {
      throw new Error('No customer found against provided input');
    }
    return dwollaBusinessCustomer;
  }
}

export default IssuerService;
