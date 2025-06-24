import HttpException from '../../Infrastructure/Errors/HttpException';
import CreateCampaignTagDTO from './CreateCampaignTagDTO';
import FindCampaignTagDTO from './FindCampaignTagDTO';
import GetCampaignTagDTO from './GetCampaignTagDTO';
import RemoveCampaignTagDTO from './RemoveCampaignTagDTO';
import { injectable, inject } from 'inversify';
import {
  ICampaignTagRepositoryId,
  ICampaignTagRepository,
} from '@domain/Core/CampaignTag/ICampaignTagRepository';
import { ICampaignTagService } from '@application/CampaignTag/ICamaignTagService';
import "reflect-metadata";

@injectable()
class CampaignTagService implements ICampaignTagService {
  constructor(
    @inject(ICampaignTagRepositoryId)
    private campaignTagRepository: ICampaignTagRepository,
  ) {}

  /**
   *
   * @param {GetCampaignTagDTO} getCampaignTagDTO
   */
  async getCampaignTag(getCampaignTagDTO: GetCampaignTagDTO) {
    const result = await this.campaignTagRepository.getByCampaign(
      getCampaignTagDTO.getCampaignId(),
      getCampaignTagDTO.getPaginationOptions(),
      getCampaignTagDTO.isShowTrashed(),
    );

    return result.getPaginatedData();
  }

  /**
   *
   * @param {FindCampaignTagDTO} findCampaignTagDTO
   */
  async findCampaignTag(findCampaignTagDTO: FindCampaignTagDTO) {
    const campaignTag = await this.campaignTagRepository.fetchById(
      findCampaignTagDTO.getCampaignTagId(),
    );

    if (!campaignTag) {
      throw new HttpException(404, 'no campaign tag found against the provided input');
    }

    return campaignTag;
  }

  /**
   *
   * @param {RemoveCampaignTagDTO} removeCampaignTagDTO
   */
  async removeCampaignTag(removeCampaignTagDTO: RemoveCampaignTagDTO) {
    const campaignTag = await this.campaignTagRepository.fetchById(
      removeCampaignTagDTO.getCampaignTagId(),
    );

    if (!campaignTag) {
      throw new HttpException(404, 'no campaign tag found against the provided input');
    }

    const deleteResult = await this.campaignTagRepository.remove(
      removeCampaignTagDTO.getCampaignTagId(),
      removeCampaignTagDTO.shouldHardDelete(),
    );

    if (!deleteResult) {
      throw new HttpException(400, 'campaign tag delete failed');
    }

    return deleteResult;
  }

  /**
   *
   * @param {CreateCampaignTagDTO} createCampaignTagDTO
   */
  async createCampaignTag(createCampaignTagDTO: CreateCampaignTagDTO) {
    const campaignId = createCampaignTagDTO.getCampaignId();
    const campaignTags = createCampaignTagDTO.getCampaignTag();

    const createResult = await this.campaignTagRepository.add({
      campaignId,
      campaignTags,
    });

    if (!createResult) {
      throw new HttpException(400, 'campaign tag create failed');
    }

    return createResult;
  }
}

export default CampaignTagService;
