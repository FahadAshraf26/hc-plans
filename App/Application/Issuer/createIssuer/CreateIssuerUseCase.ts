import HttpError from '@infrastructure/Errors/HttpException';
import Owner from '@domain/Core/Owner/Owner';
import { inject, injectable } from 'inversify';
import {
  IIssuerRepository,
  IIssuerRepositoryId,
} from '@domain/Core/Issuer/IIssuerRepository';
import { IUserRepository, IUserRepositoryId } from '@domain/Core/User/IUserRepository';
import { IOwnerDao, IOwnerDaoId } from '@domain/Core/Owner/IOwnerDao';
import { northCapitalService } from '@infrastructure/Service/PaymentProcessor';
import { ICreateIssuerUseCase } from './ICreateIssuerUseCase';

@injectable()
class CreateIssuerUseCase implements ICreateIssuerUseCase {
  constructor(
    @inject(IIssuerRepositoryId) private issuerRepository: IIssuerRepository,
    @inject(IUserRepositoryId) private userRepository: IUserRepository,
    @inject(IOwnerDaoId) private ownerDAO: IOwnerDao,
  ) {}

  async fetchOwners(ownerIds: string[]) {
    const ownerOps = ownerIds.map((ownerId) => this.ownerDAO.fetchById(ownerId));
    return Promise.all(ownerOps);
  }

  async setOwners(issuer, dto) {
    const owners = await this.fetchOwners(dto.OwnerIds());
    const hasPrimaryOwner = !!owners.find((owner: Owner) => owner.primaryOwner);
    if (!hasPrimaryOwner) {
      throw new HttpError(400, 'A primary owner is required');
    }

    owners.forEach((owner) => issuer.setOwner(owner));
    return issuer;
  }

  async getPrimaryOwnerDetails(issuer) {
    const primaryOwner = issuer.getPrimaryOwner();
    const user = await this.userRepository.fetchById(primaryOwner.userId);
    if (!user) {
      throw new HttpError(400, `no resource found`);
    }

    return user;
  }

  async persistIssur(issuer) {
    const alreadyExists = await this.issuerRepository.fetchByEmail(issuer.email);
    if (alreadyExists) {
      alreadyExists.owners = issuer.owners;
      await this.issuerRepository.update(alreadyExists);
      return alreadyExists;
    }

    await this.issuerRepository.add(issuer);
    return issuer;
  }

  async createNcIssuer(issuer, dto) {
    if (!!issuer.NCIssuerId()) {
      return issuer;
    }

    const ncIssuerId = await northCapitalService.createIssuer(
      issuer,
      await this.getPrimaryOwnerDetails(issuer),
      dto.Ip(),
    );
    issuer.setNcIssuerId(ncIssuerId);
    await this.issuerRepository.update(issuer);

    await northCapitalService.createIssuerAccount(issuer, dto.Ip());
  }
  async execute(dto) {
    let issuer = dto.Issuer();

    issuer = await this.setOwners(issuer, dto);
    issuer = await this.persistIssur(issuer);
    await this.createNcIssuer(issuer, dto);

    return true;
  }
}

export default CreateIssuerUseCase;
