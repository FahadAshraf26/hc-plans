import { ICampaignNewsRepository } from '@domain/Core/CampaignNews/ICampaignNewsRepository';
import models from '../Model';
import CampaignNews from '../../Domain/Core/CampaignNews/CampaignNews';
import CampaignNewsMedia from '../../Domain/Core/CampaignNewsMedia/CampaignNewsMedia';
import filterUndefined from '../Utils/filterUndefined';
import BaseRepository from './BaseRepository';
import { inject, injectable } from 'inversify';
import {
  ICampaignNewsMediaDAO,
  ICampaignNewsMediaDaoId,
} from '@domain/Core/CampaignNewsMedia/ICampaignNewsMediaDAO';
import PaginationData from '@domain/Utils/PaginationData';

const { CampaignNewsModel, CampaignNewsMediaModel,CampaignModel, Sequelize } = models;
const { Op } = Sequelize;

@injectable()
class CampaignNewsRepository extends BaseRepository implements ICampaignNewsRepository {
  constructor(
    @inject(ICampaignNewsMediaDaoId) private campaignNewsMediaDao: ICampaignNewsMediaDAO,
  ) {
    super(CampaignNewsModel, 'campaignNewsId', CampaignNews);
  }

  includes = [
    {
      model: CampaignNewsMediaModel,
    },
  ];

  /**
   *  Store campaignNews in database
   * @param {CampaignNews} campaignNews
   * @returns {boolean}
   */
  async add(campaignNews: CampaignNews): Promise<boolean> {
    try {
      await super.add(campaignNews);

      const createOps = campaignNews.campaignMedia.map((media) => {
        return this.campaignNewsMediaDao.add(media);
      });
      await Promise.all(createOps);

      return true;
    } catch (error) {
      throw Error(error);
    }
  }

  /**
   * Fetch all campaign news from database with pagination
   * @returns {CampaignNews[]}
   * @param options
   */
  async fetchAll(options): Promise<PaginationData<any>> {
    const { paginationOptions, showTrashed } = options;
    const { count, rows: all } = await super.fetchAll({
      paginationOptions,
      showTrashed,
      includes: this.includes,
      raw: true,
    });

    const paginationData = new PaginationData(paginationOptions, count);

    for (const campaignObj of all) {
      const campaignNews = CampaignNews.createFromObject(campaignObj);
      for (const mediaObj of campaignObj.campaignNewsMedia) {
        const media = CampaignNewsMedia.createFromObject(mediaObj);
        campaignNews.setMedia(media);
      }

      paginationData.addItem(campaignNews);
    }

    return paginationData;
  }

  /**
   * Fetch all campaign news from database by campaignId with pagination
   * @param campaignId
   * @param {number} paginationOptions
   * @param options
   * @returns CampaignNews[]
   */
  async fetchByCampaign(campaignId: string, options: any): Promise<PaginationData<any>> {
    const { showTrashed = false, query, paginationOptions } = options;
    const whereConditions = filterUndefined({
      name: query ? { [Op.like]: `%${query}%` } : undefined,
    });

    const { count, rows: all } = await super.fetchAll({
      paginationOptions,
      showTrashed,
      whereConditions,
      order: [['createdAt', 'DESC']],
      raw: true,
      includes :[
        {
          model: CampaignNewsMediaModel,
        },
        {model: CampaignModel,required:true,attributes:[], as:'campaigns', where: {
          [Op.or]: {
              campaignId,
              slug: campaignId,
          }
      },
    }
      ]
    });

    const paginationData = new PaginationData(paginationOptions, count);

    for (const campaignObj of all) {
      const campaignNews = CampaignNews.createFromObject(campaignObj);
      for (const mediaObj of campaignObj.campaignNewsMedia) {
        const media = CampaignNewsMedia.createFromObject(mediaObj);
        campaignNews.setMedia(media);
      }

      paginationData.addItem(campaignNews);
    }

    return paginationData;
  }

  /**
   * fetchById(campaignNewsId) fetch campaignNews By Id
   * @param {string} campaignNewsId
   * @returns {Object}
   */
  async fetchById(campaignNewsId: string): Promise<CampaignNews> {
    const campaignNewsObj = await super.fetchById(campaignNewsId, {
      raw: true,
      includes: this.includes,
    });

    if (!campaignNewsObj) {
      return;
    }

    const campaignNews = CampaignNews.createFromObject(campaignNewsObj);
    campaignNewsObj.campaignNewsMedia.forEach((mediaObj) => {
      const media = CampaignNewsMedia.createFromObject(mediaObj);
      campaignNews.setMedia(media);
    });

    return campaignNews;
  }

  /**
   * update(campaignNews) fetch campaignNews by id and then update it
   * @param {CampaignNews} campaignNews
   * @returns {boolean}
   */
  async update(campaignNews: CampaignNews): Promise<boolean> {
    try {
      await super.update(campaignNews);

      const updateOps = campaignNews.campaignMedia.map((media) => {
        return this.campaignNewsMediaDao.update(media);
      });
      await Promise.all(updateOps);

      return true;
    } catch (error) {
      throw Error(error);
    }
  }

  /**
   * remove(campaignNewsId) fetch campaignNews by id and delete it from database
   * @returns {boolean}
   * @param campaignNewsObj
   * @param hardDelete
   */
  async remove(campaignNewsObj: any, hardDelete: boolean = false): Promise<boolean> {
    try {
      await super.remove(campaignNewsObj, hardDelete);

      if (campaignNewsObj.campaignMedia) {
        campaignNewsObj.campaignMedia.map(async (media) => {
          await this.campaignNewsMediaDao.remove(media, hardDelete);
        });
      }

      return true;
    } catch (error) {
      throw Error(error);
    }
  }

  async fetchNewsCountByCampaign(campaignId: string): Promise<number> {
    try {
      const businessUpdateCount = await CampaignNewsModel.count({
        where: { campaignId },
      });

      return businessUpdateCount || 0;
    } catch (e) {
      throw Error(e);
    }
  }
}

export default CampaignNewsRepository;
