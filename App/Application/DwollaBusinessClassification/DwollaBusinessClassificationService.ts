import { IUserRepositoryId, IUserRepository } from '@domain/Core/User/IUserRepository';
import { IOwnerDaoId, IOwnerDao } from '@domain/Core/Owner/IOwnerDao';
import {
  IIssuerRepositoryId,
  IIssuerRepository,
} from '@domain/Core/Issuer/IIssuerRepository';
import {
  IIssuerOwnerDAO,
  IIssuerOwnerDAOId,
} from '@domain/Core/IssuerOwner/IIssuerOwnerDAO';
import { IDwollaServiceId, IDwollaService } from '@infrastructure/Service/IDwollaService';
import { inject, injectable } from 'inversify';
import { IDwollaBusinessClassificationService } from './IDwollaBusinessClassificationService';
import GetDwollaBusinessClassificationWithIssuerDTO from './GetDwollaBusinessClassificationWithIssuerDTO';

@injectable()
class DwollaBusinessClassificationService
  implements IDwollaBusinessClassificationService {
  constructor(
    @inject(IDwollaServiceId) private dwollaService: IDwollaService,
    @inject(IIssuerOwnerDAOId) private issuerOwnerDAO: IIssuerOwnerDAO,
    @inject(IIssuerRepositoryId) private issuerRepository: IIssuerRepository,
    @inject(IOwnerDaoId) private ownerDAO: IOwnerDao,
    @inject(IUserRepositoryId) private userRepository: IUserRepository,
  ) {}

  async getDwollaBusinessClassification(
    getDwollaBusinessClassificationWithIssuerDTO: GetDwollaBusinessClassificationWithIssuerDTO,
  ) {
    const ownerId = getDwollaBusinessClassificationWithIssuerDTO.getIssuerOwnerId();
    const issuerId = getDwollaBusinessClassificationWithIssuerDTO.getIssuerId();
    const issuerOwner = await this.issuerOwnerDAO.fetchOneByCustomCritera({
      whereConditions: { ownerId, issuerId },
    });

    if (!issuerOwner) {
      throw new Error('No record found against provided input');
    }
    const issuer = await this.issuerRepository.fetchById(issuerOwner.issuerId);
    const owner = await this.ownerDAO.fetchById(issuerOwner.ownerId);
    const ownerUser = await this.userRepository.fetchById(owner.userId);

    const dwollaBusinessClassification = await this.dwollaService.getBusinessClassifications();
    const businessClassificationWithIssuer = {
      firstName: ownerUser.firstName,
      lastName: ownerUser.lastName,
      email: issuer.getEmail(),
      phoneNumber: issuer.getPhoneNumber(),
      legalBusinessName: issuer.issuerName,
      issuerId: issuer.issuerId,
      businessClassifications: dwollaBusinessClassification,
      userEmail: ownerUser.email,
    };
    return businessClassificationWithIssuer;
  }
}

export default DwollaBusinessClassificationService;
