import models from '../Model';
import CampaignMedia from '../../Domain/Core/CamapignMedia/CampaignMedia';
import { ICampaignMediaRepository } from '@domain/Core/CamapignMedia/ICampaignMediaRepository';
import { injectable } from 'inversify';
import BaseRepository from './BaseRepository';
const { CampaignMediaModel, Sequelize, CampaignModel } = models;
const { Op } = Sequelize;

@injectable()
class CampaignMediaRepository extends BaseRepository implements ICampaignMediaRepository {
  constructor() {
    super(CampaignMediaModel, 'campaignMediaId', CampaignMedia);
  }

  async fetchAll({ paginationOptions, showTrashed = false }) {
    return await super.fetchAll({
      paginationOptions,
      showTrashed,
      order: [['order', 'ACS']],
    });
  }

  async fetchByCampaign(
    campaignId: string,
    paginationOptions,
    showTrashed: boolean = false,
  ) {
    return await super.fetchAll({
      includes: [
        {
          model: CampaignModel,
          required: true,
          attributes: [],
          where: {
            [Op.or]: {
              campaignId,
              slug: campaignId,
            },
          },
        },
      ],
      whereConditions: {
        campaignId,
      },
      paginationOptions,
      showTrashed,
    });
  }

  async fetchAllByCampaignId(campaignId: string) {
    const result = await CampaignMediaModel.findAll({
      where: { campaignId },
      raw: true,
      nest: true
    });

    result.map((media) => {
      return CampaignMedia.createFromObject(media);
    });

    return result;
  }
}

export default CampaignMediaRepository;
