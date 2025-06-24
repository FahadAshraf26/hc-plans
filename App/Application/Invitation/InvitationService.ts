import HttpException from '../../Infrastructure/Errors/HttpException';
import { inject, injectable } from 'inversify';
import {
  IInvitationRepository,
  IInvitationRepositoryId,
} from '@domain/Core/Invitation/IInvitationRepository';
import CreateInvitationDTO from '@application/Invitation/CreateInvitationDTO';
import GetInvitationDTO from '@application/Invitation/GetInvitationDTO';
import FindInvitationDTO from '@application/Invitation/FindInvitationDTO';
import UpdateInvitationDTO from '@application/Invitation/UpdateInvitationDTO';
import RemoveInvitationDTO from '@application/Invitation/RemoveInvitationDTO';
import { IInvitationService } from '@application/Invitation/IInvitationService';

@injectable()
class InvitationService implements IInvitationService {
  constructor(
    @inject(IInvitationRepositoryId) private invitationRepository: IInvitationRepository,
  ) {}
  /**
   *
   * @param {CreateInvitationDTO} createInvitationDTO
   * @return {Promise<*>}
   */
  async createInvitation(createInvitationDTO: CreateInvitationDTO) {
    const createResult = await this.invitationRepository.add(
      createInvitationDTO.getInvitation(),
    );

    if (!createResult) {
      throw new HttpException(400, 'Unable to create Invitation');
    }

    return createResult;
  }

  /**
   *
   * @param {GetInvitationDTO} getInvitationDTO
   * @return {Promise<{data: ([]|*[]), paginationInfo: {totalItems: *, totalPages: number, currentPage: number}}>}
   */
  async getInvitations(getInvitationDTO: GetInvitationDTO) {
    const result = await this.invitationRepository.fetchByUser(
      getInvitationDTO.getInitiator(),
      getInvitationDTO.getPaginationOptions(),
      getInvitationDTO.isShowTrashed(),
    );

    return result.getPaginatedData();
  }

  /**
   *
   * @param {FindInvitationDTO} findInvitationDTO
   * @return {Promise<*>}
   */
  async findInvitation(findInvitationDTO: FindInvitationDTO) {
    const invitation = await this.invitationRepository.fetchById(
      findInvitationDTO.getInvitationId(),
    );

    if (!invitation) {
      throw new HttpException(404, 'No Invitation record exists against provided input');
    }

    return invitation;
  }

  /**
   *
   * @param {UpdateInvitationDTO} updateInvitationDTO
   * @return {Promise<*>}
   */
  async updateInvitation(updateInvitationDTO: UpdateInvitationDTO) {
    const invitation = await this.invitationRepository.fetchById(
      updateInvitationDTO.getInvitationId(),
    );

    if (!invitation) {
      throw new HttpException(404, 'No Invitation record exists against provided input');
    }
    const updateResult = await this.invitationRepository.update(
      updateInvitationDTO.getInvitation(),
    );

    if (!updateResult) {
      throw new HttpException(400, 'Invitation Update failed');
    }

    return updateResult;
  }

  async removeInvitation(removeInvitationDTO: RemoveInvitationDTO) {
    const invitation = await this.invitationRepository.fetchById(
      removeInvitationDTO.getInvitationId(),
    );

    if (!invitation) {
      throw new HttpException(404, 'No Invitation record exists against provided input ');
    }

    const removeResult = await this.invitationRepository.remove(
      invitation,
      removeInvitationDTO.shouldHardDelete(),
    );

    if (!removeResult) {
      throw new HttpException(400, 'Invitation deleted failed');
    }

    return removeResult;
  }
}

export default InvitationService;
