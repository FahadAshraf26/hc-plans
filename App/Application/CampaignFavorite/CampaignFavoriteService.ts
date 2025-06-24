import {
  IFavoriteCampaignRepository,
  IFavoriteCampaignRepositoryId,
} from '@domain/Core/FavoriteCampaign/IFavoriteCampaignRepository';
import { inject, injectable } from 'inversify';
import HttpException from '../../Infrastructure/Errors/HttpException';
import CreateCampaignFavoriteDTO from './CreateCampaignFavoriteDTO';
import FindCampaignFavoriteDTO from './FindCampaignFavoriteDTO';
import GetCampaignFavoriteDTO from './GetCampaignFavoriteDTO';
import RemoveByInvestorDTO from './RemoveByInvestorDTO';
import RemoveCampaignFavoriteDTO from './RemoveCampaignFavoriteDTO';
import { ICampaignFavoriteService } from './ICampaignFavoriteService';

@injectable()
class CampaignFavoriteService implements ICampaignFavoriteService {
  constructor(
    @inject(IFavoriteCampaignRepositoryId)
    private favoriteCampaignRepository: IFavoriteCampaignRepository,
  ) {}
  /**
   *
   * @param {CreateCampaignFavoriteDTO} createCampaignFavoriteDTO
   */
  async createCampaignFavorite(createCampaignFavoriteDTO: CreateCampaignFavoriteDTO) {
    try {
      const favoriteCampaign = createCampaignFavoriteDTO.getFavoriteCampaign();

      const alreadyExists = await this.favoriteCampaignRepository.fetchByInfo(
        favoriteCampaign.campaignId,
        favoriteCampaign.investorId,
        true,
      );

      if (alreadyExists && !alreadyExists.deletedAt) {
        throw new HttpException(400, 'campaign already exists in favorites');
      }

      if (alreadyExists && alreadyExists.deletedAt) {
        await this.favoriteCampaignRepository.restore(alreadyExists);
        return true;
      }

      const createResult = await this.favoriteCampaignRepository.add(favoriteCampaign);

      if (!createResult) {
        throw new HttpException(400, 'add campaign to favorties failed');
      }
      return createResult;
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }

      if (err.message && err.message.toLowerCase() === 'Validation error'.toLowerCase()) {
        throw new HttpException(400, 'campaign already exists in favorites');
      }

      throw err;
    }
  }

  /**
   *
   * @param {FindCampaignFavoriteDTO} findCampaignFavoriteDTO
   */
  async findCampaignFavorite(findCampaignFavoriteDTO: FindCampaignFavoriteDTO) {
    const campaignFavorite = await this.favoriteCampaignRepository.fetchById(
      findCampaignFavoriteDTO.getCampaignFavoriteId(),
    );

    if (!campaignFavorite) {
      throw new HttpException(404, 'no favorites record found against provided input');
    }

    return campaignFavorite;
  }

  /**
   *
   * @param {RemoveCampaignFavoriteDTO} removeCampaignFavoriteDTO
   */
  async removeCampaignFavorite(removeCampaignFavoriteDTO: RemoveCampaignFavoriteDTO) {
    const campaignFavorite = await this.favoriteCampaignRepository.fetchById(
      removeCampaignFavoriteDTO.getFavoriteCampaignId(),
    );

    if (!campaignFavorite) {
      throw new HttpException(404, 'no favorites record found against provided input');
    }

    // should always hard delete campaign favorites
    const deleteResult = await this.favoriteCampaignRepository.remove(
      campaignFavorite,
      true,
    );

    if (!deleteResult) {
      throw new HttpException(400, 'remove campaign from favorites failed');
    }

    return deleteResult;
  }

  async removeByInvestor(removeByInvestorDTO: RemoveByInvestorDTO) {
    const campaignFavorite = await this.favoriteCampaignRepository.fetchByInfo(
      removeByInvestorDTO.getCampaignId(),
      removeByInvestorDTO.getInvestorId(),
    );

    if (!campaignFavorite) {
      throw new HttpException(404, 'no favorites record found against provided input');
    }

    const deleteResult = await this.favoriteCampaignRepository.remove(
      campaignFavorite,
      true,
    );

    if (!deleteResult) {
      throw new HttpException(400, 'remove campaign from favorites failed');
    }

    return deleteResult;
  }

  /**
   *
   * @param {GetCampaignFavoriteDTO} getCampaignFavoriteDTO
   */
  async getCampaignFavorite(getCampaignFavoriteDTO: GetCampaignFavoriteDTO) {
    const result = await this.favoriteCampaignRepository.fetchByCampaign(
      getCampaignFavoriteDTO.getCampaignId(),
      getCampaignFavoriteDTO.getPaginationOptions(),
      getCampaignFavoriteDTO.isShowTrashed(),
    );

    return result.getPaginatedData();
  }
}

export default CampaignFavoriteService;
