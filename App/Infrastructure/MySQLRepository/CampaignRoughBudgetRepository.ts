import Models from '../Model';
import RoughBudget from '@domain/Core/CampaignRoughBudget/CampaignRoughBudget';
import BaseRepository from './BaseRepository';
import { ICampaignRoughBudgetRepository } from '@domain/Core/CampaignRoughBudget/ICampaignRoughBudgetRepository';
import { injectable } from 'inversify';
const { RoughBudgetModel,CampaignModel ,Sequelize} = Models;
const {Op} = Sequelize;

@injectable()
class CampaignRoughBudgetRepository extends BaseRepository
  implements ICampaignRoughBudgetRepository {
  constructor() {
    super(RoughBudgetModel, 'roughBudgetId', RoughBudget);
  }

  /**
   *
   * @param {object} paginationOptions
   * @param {boolean} showTrashed
   * @returns RoughBudget[]
   */
  async fetchAll({ paginationOptions, showTrashed = false }) {
    return await super.fetchAll({
      paginationOptions,
      showTrashed,
    });
  }

  /**
   * fetch info by campaign
   * @param {string} campaignId
   * @param {object} paginationOptions
   * @param {boolean} showTrashed
   */
  async fetchByCampaign(campaignId, showTrashed = false) {
    return await super.fetchOneByCustomCritera({
      includes:[
        {model: CampaignModel,required:true,attributes:[],  where: {
          [Op.or]: {
              campaignId,
              slug: campaignId,
          }
      },
    }
      ],
      showTrashed,
    });
  }
}

export default CampaignRoughBudgetRepository;
