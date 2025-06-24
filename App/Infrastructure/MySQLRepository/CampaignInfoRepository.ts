import { ICampaignInfoRepository } from '../../Domain/Core/CampaignInfo/ICampaignInfoRepository';
import CampaignInfo from '../../Domain/Core/CampaignInfo/CampaignInfo';
import PaginationData from '../../Domain/Utils/PaginationData';
import BaseRepository from './BaseRepository';
import { injectable } from 'inversify';
import models from '../Model';
const { CampaignInfoModel,CampaignModel,Sequelize } = models;
const { Op } = Sequelize;

@injectable()
class CampaignInfoRepository extends BaseRepository implements ICampaignInfoRepository {
  constructor() {
    super(CampaignInfoModel, 'campaignInfoId', CampaignInfo);
  }

  /**
   *
   * @returns CampaignInfo[]
   * @param options
   */
  async fetchAll(options): Promise<PaginationData<CampaignInfo>> {
    const { paginationOptions, showTrashed = false } = options;
    return super.fetchAll({
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
  async fetchByCampaign(
    campaignId: string,
    showTrashed: boolean = false,
  ): Promise<CampaignInfo> {
    const campaignInfoObj = await super.fetchOneByCustomCritera({
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
      raw: true,
    });

    if (!campaignInfoObj) {
      return null;
    }

    const campaignInfo = CampaignInfo.createFromObject(campaignInfoObj);
    campaignInfo.financialHistory = JSON.parse(campaignInfo.financialHistory);
    campaignInfo.milestones = JSON.parse(campaignInfo.milestones);

    return campaignInfo;
  }

  /**
   * fetchById(campaignInfoId) fetch campaignInfo By Id
   * @param {string} campaignInfoId
   * @returns CampaignInfo
   */
  async fetchById(campaignInfoId: string): Promise<CampaignInfo> {
    const campaignInfo = await super.fetchById(campaignInfoId, { raw: true });

    if (!campaignInfo) {
      return null;
    }

    campaignInfo.financialHistory = JSON.parse(campaignInfo.financialHistory);
    campaignInfo.milestones = JSON.parse(campaignInfo.milestones);
    return CampaignInfo.createFromObject(campaignInfo);
  }
}

export default CampaignInfoRepository;
