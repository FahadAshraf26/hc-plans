import CampaignOwnerStoryOrderService from '../../Domain/Services/CampaignOwnerStory/CampaignOwnerStoryOrderService';

import HttpException from '../../Infrastructure/Errors/HttpException';
import CreateCampaignOwnerStoryDTO from './CreateCampaignOwnerStoryDTO';
import FindCampaignOwnerStoryDTO from './FindCampaignOwnerStoryDTO';
import GetCampaignOwnerStoryDTO from './GetCampaignOwnerStoryDTO';
import RemoveCampaignOwnerStoryDTO from './RemoveCampaignOwnerStoryDTO';
import UpdateCampaignOwnerStoryDTO from './UpdateCampaignOwnerStoryDTO';
import { injectable, inject } from 'inversify';
import {
  ICampaignOwnerStoryRepository,
  ICampaignOwnerStoryRepositoryId,
} from '@domain/Core/CampaignOwnerStory/ICampaignOwnerStoryRepository';
import { ICampaignOwnerStoryService } from './ICampaignOwnerStoryService';
import PaginationData, { PaginationDataResponse } from '@domain/Utils/PaginationData';
import CampaignOwnerStory from '@domain/Core/CampaignOwnerStory/CampaignOwnerStory';

@injectable()
class CampaignOwnerStoryService implements ICampaignOwnerStoryService {
  constructor(
    @inject(ICampaignOwnerStoryRepositoryId)
    private campaignOwnerStoryRepository: ICampaignOwnerStoryRepository,
  ) {}
  /**
   *
   * @param {CreateCampaignOwnerStoryDTO} createCampaignOwnerStoryDTO
   * @return {Promise<boolean>}
   */
  async createCampaignOwnerStory(
    createCampaignOwnerStoryDTO: CreateCampaignOwnerStoryDTO,
  ) {
    const createResult = await this.campaignOwnerStoryRepository.add(
      createCampaignOwnerStoryDTO.getCampaignOwnerStory(),
    );

    if (!createResult) {
      throw new HttpException(400, 'Unable to create campaignOwnerStory');
    }

    return createResult;
  }

  /**
   *
   * @param {GetCampaignOwnerStoryDTO} getCampaignOwnerStoryDTO
   * @return {Promise<{data: ([]|*[]), paginationInfo: {totalItems: *, totalPages: number, currentPage: number}}>}
   */
  async getCampaignOwnerStories(getCampaignOwnerStoryDTO: GetCampaignOwnerStoryDTO) {
    const result: any = await this.campaignOwnerStoryRepository.fetchAll({
      paginationOptions: getCampaignOwnerStoryDTO.getPaginationOptions(),
      showTrashed: getCampaignOwnerStoryDTO.isShowTrashed(),
      campaignStage: getCampaignOwnerStoryDTO.getCampaignStage(),
      investorId: getCampaignOwnerStoryDTO.getInvestorId(),
    });

    let ownerStories = result.getPaginatedData();
    const orderedOwnerStoriesObj = CampaignOwnerStoryOrderService.createFromCampaignOwnerStories(
      ownerStories.data,
    );
    ownerStories.data = await orderedOwnerStoriesObj.setCampaignOwnerStoryOrder();
    return ownerStories;
  }

  async getOwnerStoriesByCampaign(getOwnerStoriesByCampaignDTO) {
    const result = await this.campaignOwnerStoryRepository.fetchByCampaign(
      getOwnerStoriesByCampaignDTO.getCampaignId(),
      getOwnerStoriesByCampaignDTO.getPaginationOptions(),
      getOwnerStoriesByCampaignDTO.isShowTrashed(),
    );

    return result.getPaginatedData();
  }

  async findCampaignOwnerStory(findCampaignOwnerStoryDTO: FindCampaignOwnerStoryDTO) {
    const campaignOwnerStory = await this.campaignOwnerStoryRepository.fetchById(
      findCampaignOwnerStoryDTO.getCampaignOwnerStoryId(),
    );

    if (!campaignOwnerStory) {
      throw new HttpException(
        404,
        'No campaign OwnerStory record exists against the provided input',
      );
    }

    return campaignOwnerStory;
  }

  /**
   *
   * @param {UpdateCampaignOwnerStoryDTO} updateCampaignOwnerStoryDTO
   * @return {Promise<*>}
   */
  async updateCampaignOwnerStory(
    updateCampaignOwnerStoryDTO: UpdateCampaignOwnerStoryDTO,
  ) {
    const campaignOwnerStory = await this.campaignOwnerStoryRepository.fetchById(
      updateCampaignOwnerStoryDTO.getCampaignOwnerStoryId(),
    );

    if (!campaignOwnerStory) {
      throw new HttpException(
        404,
        'No CampaignOwnerStory record exists against the provided input',
      );
    }
    const updateResult = await this.campaignOwnerStoryRepository.update(
      updateCampaignOwnerStoryDTO.getCampaignOwnerStory(),
    );

    if (!updateResult) {
      throw new HttpException(400, 'Campaign OwnerStory update failed');
    }

    return updateResult;
  }

  async removeCampaignOwnerStory(
    removeCampaignOwnerStoryDTO: RemoveCampaignOwnerStoryDTO,
  ) {
    const campaignOwnerStory = await this.campaignOwnerStoryRepository.fetchById(
      removeCampaignOwnerStoryDTO.getCampaignOwnerStoryId(),
    );

    if (!campaignOwnerStory) {
      throw new HttpException(
        404,
        'No CampaignOwnerStory record exists against the provided input',
      );
    }

    const removeResult = await this.campaignOwnerStoryRepository.remove(
      campaignOwnerStory,
      removeCampaignOwnerStoryDTO.shouldHardDeleted(),
    );

    if (!removeResult) {
      throw new HttpException(400, 'Campaign OwnerStory deleted failed');
    }

    return removeResult;
  }
}
export default CampaignOwnerStoryService;
