import HttpException from '../../Infrastructure/Errors/HttpException';
import { inject, injectable } from 'inversify';
import {
  ICampaignPLRepository,
  ICampaignPLRepositoryId,
} from '@domain/Core/CampaignPL/ICampaignPLRepository';
import { ICampaignPLService } from '@application/CampaignPL/ICampaignPLService';

@injectable()
class CampaignPLService implements ICampaignPLService {
  constructor(
    @inject(ICampaignPLRepositoryId) private campaignPLRepository: ICampaignPLRepository,
  ) {}
  /**
   * get campaign info
   * @param {GetPLDTO} getPLDTO
   * @throws 404 - pl not found
   * @returns PL
   */
  async getPL(getPLDTO) {
    const pl = await this.campaignPLRepository.fetchByCampaign(
      getPLDTO.getCampaignId(),
      getPLDTO.isShowTrashed(),
    );

    if (!pl) {
      throw new HttpException(
        404,
        'no campaign pl record exists against the provided input',
      );
    }

    return pl;
  }

  async findPL(findPLDTO) {
    const pl = await this.campaignPLRepository.fetchById(findPLDTO.getPLId());

    if (!pl) {
      throw new HttpException(
        404,
        'no campaign pl record exists against the provided input',
      );
    }

    return pl;
  }

  /**
   * udpate campaign Info
   * @param {UpdatePLDTO} updatePLDTO
   * @throws 404 - pl not found
   * @throws 400 - update failed
   * @returns boolean
   */
  async updatePL(updatePLDTO) {
    const pl = await this.campaignPLRepository.fetchById(updatePLDTO.getPLId());

    if (!pl) {
      throw new HttpException(
        404,
        'no campaign pl record exists against the provided input',
      );
    }

    const updateResult = await this.campaignPLRepository.update(updatePLDTO.getPL());

    if (!updateResult) {
      throw new HttpException(400, 'campaign pl update update failed');
    }

    return updateResult;
  }

  /**
   * delete campaign Info
   * @param {RemovePLDTO} removePLDTO
   * @throws 404 - pl not found
   * @throws 400 - delete failed
   * @returns boolean
   */
  async removePL(removePLDTO) {
    const pl = await this.campaignPLRepository.fetchById(removePLDTO.getPLId());

    if (!pl) {
      throw new HttpException(
        404,
        'no campaign pl record exists against the provided input',
      );
    }

    const removeResult = await this.campaignPLRepository.remove(
      pl,
      removePLDTO.shouldHardDelete(),
    );

    if (!removeResult) {
      throw new HttpException(400, 'campaign pl update update failed');
    }

    return removeResult;
  }

  /**
   * create campaign info
   * @param {CreatePLDTO} createPLDTO
   * @throws 400 - create failed
   * @returns boolean
   */
  async createPL(createPLDTO) {
    const createResult = await this.campaignPLRepository.add(createPLDTO.getPL());

    if (!createResult) {
      throw new HttpException(400, 'create failed');
    }

    return createResult;
  }
}

export default CampaignPLService;
