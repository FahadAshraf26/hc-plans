import HttpException from '../../Infrastructure/Errors/HttpException';
import { unlink, exists } from 'fs';
import { promisify } from 'util';
import CreateCampaignMediaDTO from './CreateCampaignMediaDTO';
import FindCampaignMediaDTO from './FindCampaignMediaDTO';
import GetCampaignMediaDTO from './GetCampaignMediaDTO';
import RemoveCampaignMediaDTO from './RemoveCampaignMediaDTO';
import { inject, injectable } from 'inversify';
import {
  ICampaignMediaRepository,
  ICampaignMediaRepositoryId,
} from '@domain/Core/CamapignMedia/ICampaignMediaRepository';
import UpdateCampaignMediaDTO from './UpdateCampaignMediaDTO';
import CampaignMedia from '@domain/Core/CamapignMedia/CampaignMedia';
const DeleteFile = promisify(unlink);
const FileExists = promisify(exists);

@injectable()
class CampaignMediaService {
  constructor(
    @inject(ICampaignMediaRepositoryId)
    private campaignMediaRepository: ICampaignMediaRepository,
  ) {}

  /**
   *
   * @param {CreateCampaignMediaDTO} createCampaignMediaDTO
   * @return {Promise<boolean>}
   */
  async createCampaignMedia(createCampaignMediaDTO: CreateCampaignMediaDTO) {
    const media = createCampaignMediaDTO.getCampaignMedia();
    const createOps = media.map((mediaObj, index) => {
      mediaObj.setposition(index);
      return this.campaignMediaRepository.add(mediaObj);
    });

    const result = await Promise.all(createOps);

    result.forEach((res) => {
      if (result instanceof Error) {
        throw new HttpException(400, 'unable to upload some of the files');
      }
    });

    return true;
  }

  /**
   *
   * @param {GetCampaignMediaDTO} getCampaignMediaDTO
   * @return {Promise<{data: ([]|*[]), paginationInfo: {totalItems: *, totalPages: number, currentPage: number}}>}
   */
  async getCampaignMedia(getCampaignMediaDTO: GetCampaignMediaDTO) {
    const result = await this.campaignMediaRepository.fetchByCampaign(
      getCampaignMediaDTO.getCampaignId(),
      getCampaignMediaDTO.getPaginationOptions(),
      getCampaignMediaDTO.isShowTrashed(),
    );

    result.items.sort(function (a, b) {
      return a.position - b.position;
    });
    return result.getPaginatedData();
  }

  async findCampaignMedia(findCampaignMediaDTO: FindCampaignMediaDTO) {
    const campaignMedia = await this.campaignMediaRepository.fetchById(
      findCampaignMediaDTO.getCampaignMediaId(),
    );

    if (!campaignMedia) {
      throw new HttpException(
        404,
        'No campaign media record exists against the provided input',
      );
    }

    return campaignMedia;
  }

  async removeCampaignMedia(removeCampaignMediaDTO: RemoveCampaignMediaDTO) {
    const campaignMedia = await this.campaignMediaRepository.fetchById(
      removeCampaignMediaDTO.getCampaignMediaId(),
    );

    if (!campaignMedia) {
      throw new HttpException(
        404,
        'No CampaignMedia record exists against the provided input',
      );
    }

    const removeResult = await this.campaignMediaRepository.remove(
      campaignMedia,
      removeCampaignMediaDTO.shouldHardDelete(),
    );

    if (removeCampaignMediaDTO.shouldHardDelete()) {
      const fileExists = await FileExists(campaignMedia.path);
      if (fileExists) {
        await DeleteFile(campaignMedia.path);
      }
    }

    if (!removeResult) {
      throw new HttpException(400, 'Campaign Media deleted failed');
    }

    return removeResult;
  }
  async updateCampaignMedia(updateCampaignMediaDTO: UpdateCampaignMediaDTO) {
    const files = updateCampaignMediaDTO.getFiles();
    files.forEach(async (file, index) => {
      // Remove file.mimeType !== 'video/youtube' condition to set position of youtube video position
      //if (file.mimeType !== 'video/youtube') {
      const media = CampaignMedia.createFromObject(file);
      media.setposition(index + 1);
      return this.campaignMediaRepository.update(media);
    });
  }
}

export default CampaignMediaService;
