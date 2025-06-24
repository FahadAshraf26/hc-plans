import { ICampaignNewsMediaDAO } from '@domain/Core/CampaignNewsMedia/ICampaignNewsMediaDAO';
import models from '../Model';
import CampaignNewsMedia from '../../Domain/Core/CampaignNewsMedia/CampaignNewsMedia';
import BaseRepository from './BaseRepository';
import { injectable } from 'inversify';
const { CampaignNewsMediaModel } = models;

@injectable()
class CampaignNewsMediaDAO extends BaseRepository implements ICampaignNewsMediaDAO {
  constructor() {
    super(CampaignNewsMediaModel, 'campaignNewsMediaId', CampaignNewsMedia);
  }

  /**
   * update(campaignNewsMedia) fetch campaignNewsMedia by id and then update it
   * @param {CampaignNewsMedia} campaignNewsMedia
   * @returns {boolean}
   */
  async update(campaignNewsMedia): Promise<boolean> {
    try {
      const campaignMediaObj = await super.fetchById(
        campaignNewsMedia.campaignNewsMediaId,
      );

      if (campaignMediaObj) {
        return super.update(campaignNewsMedia);
      }

      return super.add(campaignNewsMedia);
    } catch (error) {
      throw Error(error);
    }
  }
}

export default CampaignNewsMediaDAO;
