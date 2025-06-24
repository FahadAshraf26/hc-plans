import models from '../Model';
import BaseRepository from './BaseRepository';
import { injectable } from 'inversify';
import { IFavoriteCampaignRepository } from '@domain/Core/FavoriteCampaign/IFavoriteCampaignRepository';
import FavoriteCampaign from '@domain/Core/FavoriteCampaign/FavoriteCampaign';

const { FavoriteCampaignModel, InvestorModel, CampaignModel,UserModel } = models;

@injectable()
class FavoriteCampaignRepository extends BaseRepository
  implements IFavoriteCampaignRepository {
  includes: [{}];

  constructor() {
    super(FavoriteCampaignModel, 'favoriteCampaignId', FavoriteCampaign);
    this.includes = [
      {
        model: InvestorModel,
        as: 'investor',
      },
    ];
  }

  /**
   *
   * @param {string} campaignId
   * @param {object} paginationOptions
   * @param {boolean} showTrashed
   */
  async fetchByCampaign(campaignId: string, paginationOptions, showTrashed: boolean) {
    return await super.fetchAll({
      paginationOptions,
      showTrashed,
      whereConditions: { campaignId },
      includes: this.includes,
    });
  }

  /**
   * fetchById(favoriteCampaignId) fetch favoriteCampaign By Id
   * @param {string} favoriteCampaignId
   * @returns Object
   */
  async fetchById(favoriteCampaignId: string) {
    return await super.fetchById(favoriteCampaignId, { includes: this.includes });
  }

  async fetchByInfo(
    campaignId: string,
    investorId: string,
    showTrashed: boolean = false,
  ) {
    return await super.fetchOneByCustomCritera({
      whereConditions: { campaignId, investorId },
      includes: this.includes,
      showTrashed,
    });
  }

  /**
   *
   * @param {FavoriteCampaign} favoriteCampaign
   * @returns boolean
   */
  async upsert(favoriteCampaign) {
    try {
      const favoriteCampaignObj = await super.fetchById(
        favoriteCampaign.favoriteCampaignId,
      );

      if (favoriteCampaignObj) {
        return await super.update(favoriteCampaign);
      }

      return await super.add(favoriteCampaign);
    } catch (error) {
      throw new Error(error);
    }
  }

  async fetchByInvestor(
    investorId: string,
    paginationOptions,
    showTrashed: boolean = false,
  ) {
    return await super.fetchAll({
      includes: [{ model: CampaignModel, required: true, attributes: ['campaignName'] }],
      whereConditions: { investorId },
      paginationOptions,
      showTrashed,
    });
  }

  async fetchLikesCountByCampaign(campaignId: string) {
    try {
      const campaignLikesCount = await FavoriteCampaignModel.count({
        where: { campaignId },
      });

      return campaignLikesCount || 0;
    } catch (e) {
      throw Error(e);
    }
  }

  async fetchLikesCountByInvestor(investorId: string) {
    try {
      const campaignLikesCount = await FavoriteCampaignModel.count({
        where: { investorId },
      });

      return campaignLikesCount || 0;
    } catch (e) {
      throw Error(e);
    }
  }

  async remoevFavoritesByCampaign(campaignId: string) {
    return FavoriteCampaignModel.destroy({
      where: {
        campaignId,
      },
    });
  }

  async fetchByInvestorAndCampaign(investorId, campaignId) {
    return super.fetchOneByCustomCritera({
      whereConditions: {
        investorId,
        campaignId,
      },
    });
  }

  async fetchAllByCampaign(campaignId: string) {
    const favoriteCampaigns = await FavoriteCampaignModel.findAll({
      where: { campaignId },
      include: [
        {
          model: InvestorModel,
          as: 'investor',
          include: [
            {
              model: UserModel,
              as:'user'
           } 
          ]
        },
        {
          model: CampaignModel,
          as:'campaign'
        }
      ]
    });
    return favoriteCampaigns.map((item) => {
      return FavoriteCampaign.createFromObject(item);
    });
  }
}

export default FavoriteCampaignRepository;
