import {
  IIssuerRepositoryId,
  IIssuerRepository,
} from '@domain/Core/Issuer/IIssuerRepository';
import { IUserRepositoryId, IUserRepository } from '@domain/Core/User/IUserRepository';
import {
  IHoneycombDwollaCustomerRepository,
  IHoneycombDwollaCustomerRepositoryId,
} from '@domain/Core/HoneycombDwollaCustomer/IHoneycombDwollaCustomerRepository';
import { IDwollaServiceId, IDwollaService } from '@infrastructure/Service/IDwollaService';
import {
  IHoneycombDwollaBeneficialOwnerRepositoryId,
  IHoneycombDwollaBeneficialOwnerRepository,
} from '@domain/Core/HoneycombDwollaBeneficialOwner/IHoneycombDwollaBeneficialOwnerRepository';
import { inject, injectable } from 'inversify';
import CreateHoneycombDwollaBeneficialOwnerDTO from './CreateHoneycombDwollaBeneficialOwnerDTO';
import { IHoneycombDwollaBeneficialOwnerService } from './IHoneycombDwollaBeneficialOwnerService';
import HoneycombDwollaBeneficialOwner from '@domain/Core/HoneycombDwollaBeneficialOwner/HoneycombDwollaBeneficialOwner';

@injectable()
class HoneycombDwollaBeneficialOwnerService
  implements IHoneycombDwollaBeneficialOwnerService {
  constructor(
    @inject(IHoneycombDwollaBeneficialOwnerRepositoryId)
    private honeycombDwollaBeneficialOwnerRepository: IHoneycombDwollaBeneficialOwnerRepository,
    @inject(IDwollaServiceId) private dwollaService: IDwollaService,
    @inject(IHoneycombDwollaCustomerRepositoryId)
    private honeycombDwollaCustomerRepository: IHoneycombDwollaCustomerRepository,
    @inject(IUserRepositoryId) private userRepository: IUserRepository,
    @inject(IIssuerRepositoryId) private issuerRepository: IIssuerRepository,
  ) {}
  async createHoneycombDwollaBeneficialOwner(
    createHoneycombDwollaBeneficialOwnerDTO: CreateHoneycombDwollaBeneficialOwnerDTO,
  ): Promise<any> {
    const issuer = await this.issuerRepository.fetchById(
      createHoneycombDwollaBeneficialOwnerDTO.getIssuerId(),
    );

    const dwollaCustomerObj = await this.honeycombDwollaCustomerRepository.fetchByIssuerId(
      issuer.issuerId,
    );

    if (dwollaCustomerObj === null) {
      throw new Error('Customer not found');
    }

    const beneficialOwner = issuer.owners.filter((item) => item.beneficialOwner === true);

    if (beneficialOwner.length === 0) {
      throw new Error('Beneficial Owner not found');
    }

    const user = await this.userRepository.fetchById(beneficialOwner[0].userId);

    if (!user) {
      throw new Error('User not found');
    }

    const beneficialOwnerInput = await this.dwollaService.createBenenficialOwnerInpupt(
      user,
    );

    const response = await this.dwollaService.createBeneficialOwner(
      dwollaCustomerObj.getDwollaCustomerId(),
      beneficialOwnerInput,
    );

    const { owner } = user;
    const dwollaBeneficialOwner = HoneycombDwollaBeneficialOwner.createFromDetail(
      response,
    );
    dwollaBeneficialOwner.setDwollaCustomerId(dwollaCustomerObj.getDwollaCustomerId());
    dwollaBeneficialOwner.setOwnerId(owner.ownerId);

    await this.honeycombDwollaBeneficialOwnerRepository.createDwollaBeneficialOwner(
      dwollaBeneficialOwner,
    );

    return this.dwollaService.certifyOwner(dwollaCustomerObj.getDwollaCustomerId());
  }
}

export default HoneycombDwollaBeneficialOwnerService;
