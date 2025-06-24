import HttpException from '../../Infrastructure/Errors/HttpException';
import { inject, injectable } from 'inversify';
import {
  ICampaignNotesRepository,
  ICampaignNotesRepositoryId,
} from '@domain/Core/CampaignNotes/ICampaignNotesRepository';
import { ICampaignNotesService } from '@application/CampaignNotes/ICampaignNotesService';

@injectable()
class CampaignNotesService implements ICampaignNotesService {
  constructor(
    @inject(ICampaignNotesRepositoryId)
    private campaignNotesRepository: ICampaignNotesRepository,
  ) {}
  /**
   *
   * @param {CreateCampaignNotesDTO} createCampaignNotesDTO
   * @return {Promise<boolean>}
   */
  async createCampaignNotes(createCampaignNotesDTO) {
    const createResult = await this.campaignNotesRepository.add(
      createCampaignNotesDTO.getCampaignNotes(),
    );

    if (!createResult) {
      throw new HttpException(400, 'Unable to create campaignNotes');
    }

    return createResult;
  }

  /**
   *
   * @param {GetCampaignNotesDTO} getCampaignNotesDTO
   * @return {Promise<{data: ([]|*[]), paginationInfo: {totalItems: *, totalPages: number, currentPage: number}}>}
   */
  async getCampaignNotes(getCampaignNotesDTO) {
    const result = await this.campaignNotesRepository.fetchByCampaign(
      getCampaignNotesDTO.getCampaignId(),
      getCampaignNotesDTO.getPaginationOptions(),
      getCampaignNotesDTO.isShowTrashed(),
    );

    return result.getPaginatedData();
  }

  async findCampaignNotes(findCampaignNotesDTO) {
    const campaignNotes = await this.campaignNotesRepository.fetchById(
      findCampaignNotesDTO.getCampaignNotesId(),
    );

    if (!campaignNotes) {
      throw new HttpException(
        404,
        'No campaign Notes record exists against the provided input',
      );
    }

    return campaignNotes;
  }

  /**
   *
   * @param {UpdateCampaignNotesDTO} updateCampaignNotesDTO
   * @return {Promise<*>}
   */
  async updateCampaignNotes(updateCampaignNotesDTO) {
    const campaignNotes = await this.campaignNotesRepository.fetchById(
      updateCampaignNotesDTO.getCampaignNotesId(),
    );

    if (!campaignNotes) {
      throw new HttpException(
        404,
        'No CampaignNotes record exists against the provided input',
      );
    }
    const updateResult = await this.campaignNotesRepository.update(
      updateCampaignNotesDTO.getCampaignNotes(),
    );

    if (!updateResult) {
      throw new HttpException(400, 'Campaign Notes update failed');
    }

    return updateResult;
  }

  async removeCampaignNotes(removeCampaignNotesDTO) {
    const campaignNotes = await this.campaignNotesRepository.fetchById(
      removeCampaignNotesDTO.getCampaignNotesId(),
    );

    if (!campaignNotes) {
      throw new HttpException(
        404,
        'No CampaignNotes record exists against the provided input',
      );
    }

    const removeResult = await this.campaignNotesRepository.remove(
      campaignNotes,
      removeCampaignNotesDTO.shouldHardDeleted(),
    );

    if (!removeResult) {
      throw new HttpException(400, 'Campaign Notes deleted failed');
    }

    return removeResult;
  }
}

export default CampaignNotesService;
