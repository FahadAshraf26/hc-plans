import HttpException from '../../Infrastructure/Errors/HttpException';
import { inject, injectable } from 'inversify';
import {
  ICampaignRoughBudgetRepository,
  ICampaignRoughBudgetRepositoryId,
} from '@domain/Core/CampaignRoughBudget/ICampaignRoughBudgetRepository';
import { ICampaignRoughBudgetService } from '@application/CampaignRoughBudget/ICampaignRoughBudgetService';

@injectable()
class CampaignRoughBudgetService implements ICampaignRoughBudgetService {
  constructor(
    @inject(ICampaignRoughBudgetRepositoryId)
    private campaignRoughBudgetRepository: ICampaignRoughBudgetRepository,
  ) {}
  /**
   * get campaign info
   * @param {GetRoughBudgetDTO} getRoughBudgetDTO
   * @throws 404 - roughBudget not found
   * @returns RoughBudget
   */
  async getRoughBudget(getRoughBudgetDTO) {
    const roughBudget = await this.campaignRoughBudgetRepository.fetchByCampaign(
      getRoughBudgetDTO.getCampaignId(),
      getRoughBudgetDTO.isShowTrashed(),
    );

    if (!roughBudget) {
      throw new HttpException(
        404,
        'no campaign rough budget record exists against the provided input',
      );
    }

    return roughBudget;
  }

  async findRoughBudget(findRoughBudgetDTO) {
    const roughBudget = await this.campaignRoughBudgetRepository.fetchById(
      findRoughBudgetDTO.getRoughBudgetId(),
    );

    if (!roughBudget) {
      throw new HttpException(
        404,
        'no campaign rough budget record exists against the provided input',
      );
    }

    return roughBudget;
  }

  /**
   * udpate campaign Info
   * @param {UpdateRoughBudgetDTO} updateRoughBudgetDTO
   * @throws 404 - roughBudget not found
   * @throws 400 - update failed
   * @returns boolean
   */
  async updateRoughBudget(updateRoughBudgetDTO) {
    const roughBudget = await this.campaignRoughBudgetRepository.fetchById(
      updateRoughBudgetDTO.getRoughBudgetId(),
    );

    if (!roughBudget) {
      throw new HttpException(
        404,
        'no campaign rough budget record exists against the provided input',
      );
    }

    const updateResult = await this.campaignRoughBudgetRepository.update(
      updateRoughBudgetDTO.getRoughBudget(),
    );

    if (!updateResult) {
      throw new HttpException(400, 'campaign rough budget update failed');
    }

    return updateResult;
  }

  /**
   * delete campaign Info
   * @param {RemoveRoughBudgetDTO} removeRoughBudgetDTO
   * @throws 404 - roughBudget not found
   * @throws 400 - delete failed
   * @returns boolean
   */
  async removeRoughBudget(removeRoughBudgetDTO) {
    const roughBudget = await this.campaignRoughBudgetRepository.fetchById(
      removeRoughBudgetDTO.getRoughBudgetId(),
    );

    if (!roughBudget) {
      throw new HttpException(
        404,
        'no campaign rough budget record exists against the provided input',
      );
    }

    const removeResult = await this.campaignRoughBudgetRepository.remove(
      roughBudget,
      removeRoughBudgetDTO.shouldHardDelete(),
    );

    if (!removeResult) {
      throw new HttpException(400, 'campaign rough budget update failed');
    }

    return removeResult;
  }

  /**
   * create campaign info
   * @param {CreateRoughBudgetDTO} createRoughBudgetDTO
   * @throws 400 - create failed
   * @returns boolean
   */
  async createRoughBudget(createRoughBudgetDTO) {
    const createResult = await this.campaignRoughBudgetRepository.add(
      createRoughBudgetDTO.getRoughBudget(),
    );

    if (!createResult) {
      throw new HttpException(400, 'create failed');
    }

    return createResult;
  }
}

export default CampaignRoughBudgetService;
