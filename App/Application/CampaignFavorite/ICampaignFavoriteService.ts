import CreateCampaignFavoriteDTO from './CreateCampaignFavoriteDTO';
import FindCampaignFavoriteDTO from './FindCampaignFavoriteDTO';
import GetCampaignFavoriteDTO from './GetCampaignFavoriteDTO';
import RemoveByInvestorDTO from './RemoveByInvestorDTO';
import RemoveCampaignFavoriteDTO from './RemoveCampaignFavoriteDTO';
import FavoriteCampaign from '@domain/Core/FavoriteCampaign/FavoriteCampaign';

export const ICampaignFavoriteServiceId = Symbol.for('ICampaignFavoriteService');

type response = {
  status: string;
  paginationInfo;
  data: Array<any>;
};

export interface ICampaignFavoriteService {
  createCampaignFavorite(
    createCampaignFavoriteDTO: CreateCampaignFavoriteDTO,
  ): Promise<boolean>;
  findCampaignFavorite(
    findCampaignFavoriteDTO: FindCampaignFavoriteDTO,
  ): Promise<FavoriteCampaign>;
  removeCampaignFavorite(
    removeCampaignFavoriteDTO: RemoveCampaignFavoriteDTO,
  ): Promise<boolean>;
  removeByInvestor(removeByInvestorDTO: RemoveByInvestorDTO): Promise<boolean>;
  getCampaignFavorite(getCampaignFavoriteDTO: GetCampaignFavoriteDTO): Promise<response>;
}
