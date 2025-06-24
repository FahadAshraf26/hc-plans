import PaginationData from '@domain/Utils/PaginationData';
import { IBaseRepository } from '@domain/Core/BaseEntity/IBaseRepository';
import FavoriteCampaign from './FavoriteCampaign';

export const IFavoriteCampaignRepositoryId = Symbol.for('IFavoriteCampaignRepository');

export interface IFavoriteCampaignRepository extends IBaseRepository {
  fetchByCampaign(
    campaignId: string,
    paginationOptions,
    showTrashed: boolean,
  ): Promise<PaginationData<FavoriteCampaign>>;

  fetchById(favoriteCampaignId: string): Promise<FavoriteCampaign>;

  fetchByInfo(
    campaignId: string,
    investorId: string,
    showTrashed?: boolean,
  ): Promise<FavoriteCampaign>;

  upsert(favoriteCampaign: FavoriteCampaign): Promise<boolean>;

  fetchByInvestor(
    investorId: string,
    paginationOptions,
    showTrashed: boolean,
  ): Promise<PaginationData<FavoriteCampaign>>;

  fetchLikesCountByCampaign(campaignId: string): Promise<number>;

  fetchLikesCountByInvestor(investorId: string): Promise<number>;

  remoevFavoritesByCampaign(campaignId: string): Promise<boolean>;

  fetchByInvestorAndCampaign(
    investorId: string,
    campaignId: string,
  ): Promise<FavoriteCampaign>;
  fetchAllByCampaign(campaignId: string);
}
