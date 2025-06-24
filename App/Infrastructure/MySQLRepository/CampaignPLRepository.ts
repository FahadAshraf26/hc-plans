import { injectable } from 'inversify';
import Models from '../Model';
import { ICampaignPLRepository } from '@domain/Core/CampaignPL/ICampaignPLRepository';
import PL from '@domain/Core/CampaignPL/CampaignPL';
import BaseRepository from './BaseRepository';

const { PLModel,CampaignModel,Sequelize } = Models;
const {Op} = Sequelize;

@injectable()
class CampaignPLRepository extends BaseRepository implements ICampaignPLRepository {
  constructor() {
    super(PLModel, 'plId', PL);
  }

  /**
   *
   * @param {object} paginationOptions
   * @param {boolean} showTrashed
   * @returns PL[]
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

export default CampaignPLRepository;
