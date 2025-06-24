import GetCampaignInfoDTO from './GetCampaignInfoDTO';
import FindCampaignInfoDTO from './FindCampaignInfoDTO';
import UpdateCampaignInfoDTO from './UpdateCampaignInfoDTO';
import RemoveCampaignInfoDTO from './RemoveCampaignInfoDTO';
import CreateCampaignInfoDTO from './CreateCampaignInfoDTO';
import { inject, injectable } from 'inversify';
import {
  ICampaignInfoRepository,
  ICampaignInfoRepositoryId,
} from '@domain/Core/CampaignInfo/ICampaignInfoRepository';
import HttpException from '@infrastructure/Errors/HttpException';

@injectable()
class CampaignInfoService {
  constructor(
    @inject(ICampaignInfoRepositoryId)
    private campaignInfoRepository: ICampaignInfoRepository,
  ) {}

  /**
   * get campaign info
   * @param {GetCampaignInfoDTO} getCampaignInfoDTO
   * @throws 404 - campaignInfo not found
   * @returns CampaignInfo
   */
  async getCampaignInfo(getCampaignInfoDTO: GetCampaignInfoDTO): Promise<any> {
    const campaignInfo = await this.campaignInfoRepository.fetchByCampaign(
      getCampaignInfoDTO.getCampaignId(),
      getCampaignInfoDTO.isShowTrashed(),
    );

    if (!campaignInfo) {
      return {};
    }

    return campaignInfo;
  }

  async findCampaignInfo(findCampaignInfoDTO: FindCampaignInfoDTO): Promise<any> {
    const campaignInfo = await this.campaignInfoRepository.fetchById(
      findCampaignInfoDTO.getCampaignInfoId(),
    );

    if (!campaignInfo) {
      throw new HttpException(
        404,
        'no campaign info record exists against the provided input',
      );
    }

    return campaignInfo;
  }

  /**
   * udpate campaign Info
   * @param {UpdateCampaignInfoDTO} updateCampaignInfoDTO
   * @throws 404 - campaignInfo not found
   * @throws 400 - update failed
   * @returns boolean
   */
  async updateCampaignInfo(
    updateCampaignInfoDTO: UpdateCampaignInfoDTO,
  ): Promise<boolean> {
    const campaignInfo = await this.campaignInfoRepository.fetchById(
      updateCampaignInfoDTO.getCampaignInfoId(),
    );

    if (!campaignInfo) {
      throw new HttpException(
        404,
        'no campaign info record exists against the provided input',
      );
    }

    const updateResult = await this.campaignInfoRepository.update(
      updateCampaignInfoDTO.getCampaignInfo(),
    );

    if (!updateResult) {
      throw new HttpException(400, 'campaign info update update failed');
    }

    return updateResult;
  }

  /**
   * delete campaign Info
   * @param {RemoveCampaignInfoDTO} removeCampaignInfoDTO
   * @throws 404 - campaignInfo not found
   * @throws 400 - delete failed
   * @returns boolean
   */
  async removeCampaignInfo(
    removeCampaignInfoDTO: RemoveCampaignInfoDTO,
  ): Promise<boolean> {
    const campaignInfo = await this.campaignInfoRepository.fetchById(
      removeCampaignInfoDTO.getCampaignInfoId(),
    );

    if (!campaignInfo) {
      throw new HttpException(
        404,
        'no campaign info record exists against the provided input',
      );
    }

    const removeResult = await this.campaignInfoRepository.remove(
      campaignInfo,
      removeCampaignInfoDTO.shouldHardDelete(),
    );

    if (!removeResult) {
      throw new HttpException(400, 'campaign info update update failed');
    }

    return removeResult;
  }

  /**
   * create campaign info
   * @param {CreateCampaignInfoDTO} createCampaignInfoDTO
   * @throws 400 - create failed
   * @returns boolean
   */
  async createCampaignInfo(
    createCampaignInfoDTO: CreateCampaignInfoDTO,
  ): Promise<boolean> {
    const createResult = await this.campaignInfoRepository.add(
      createCampaignInfoDTO.getCampaignInfo(),
    );

    if (!createResult) {
      throw new HttpException(400, 'create failed');
    }

    return createResult;
  }
}

export default CampaignInfoService;
