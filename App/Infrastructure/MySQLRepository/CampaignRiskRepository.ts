import models from '../Model';
import CampaignRisk from '../../Domain/Core/CampaignRisk/CampaignRisk';
import filterUndefined from '../Utils/filterUndefined';
import { ICampaignRiskRepository } from '@domain/Core/CampaignRisk/ICampaignRiskRepository';
import BaseRepository from './BaseRepository';
import { injectable } from 'inversify';
const { CampaignRiskModel, CampaignModel, Sequelize } = models;
const { Op } = Sequelize;

@injectable()
class CampaignRiskRepository extends BaseRepository implements ICampaignRiskRepository {
  constructor() {
    super(CampaignRiskModel, 'campaignRiskId', CampaignRisk);
  }
  /**
   * Fetch all campaignRisks from database with pagination
   * @returns {CampaignRisk[]}
   * @param paginationOptions
   * @param showTrashed
   */
  async fetchAll(paginationOptions, showTrashed = false) {
    return await super.fetchAll({
      paginationOptions,
      showTrashed,
      order: [['createdAt', 'ASC']],
    });
  }

  /**
   * Fetch all campaignRisks from database by Campaign with pagination
   * @returns {CampaignRisk[]}
   * @param campaignId
   * @param paginationOptions
   * @param options
   */
  async fetchByCampaign(campaignId, paginationOptions, options) {
    const { showTrashed = false, query } = options;
    const whereConditions = filterUndefined({
      title: query ? { [Op.like]: `%${query}%` } : undefined,
      campaignId,
    });

    return await super.fetchAll({
      paginationOptions,
      showTrashed,
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
      whereConditions,
    });
  }

  async removeByCampaign(campaignId) {
    return await CampaignRiskModel.destroy({
      where: {
        campaignId,
      },
    });
  }
}

export default CampaignRiskRepository;
