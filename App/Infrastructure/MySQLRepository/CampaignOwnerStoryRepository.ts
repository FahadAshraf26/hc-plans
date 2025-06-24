import models from '../Model';
import CampaignOwnerStory from '@domain/Core/CampaignOwnerStory/CampaignOwnerStory';
import BaseRepository from './BaseRepository';
import { CampaignStage } from '@domain/Core/ValueObjects/CampaignStage';
import filterUndefined from '../Utils/filterUndefined';
import { ICampaignOwnerStoryRepository } from '@domain/Core/CampaignOwnerStory/ICampaignOwnerStoryRepository';
import { injectable } from 'inversify';
const {
  CampaignOwnerStoryModel,
  CampaignModel,
  IssuerModel,
  InvestorModel,
  Sequelize,
} = models;
const { Op } = Sequelize;

@injectable()
class CampaignOwnerStoryRepository extends BaseRepository
  implements ICampaignOwnerStoryRepository {
  constructor() {
    super(CampaignOwnerStoryModel, 'campaignOwnerStoryId', CampaignOwnerStory);
  }

  /**
   * Fetch all campaignOwnerStorys from database with pagination
   * @returns CampaignOwnerStory[]
   * @param paginationOptions
   * @param showTrashed
   */
  async fetchAll({
    paginationOptions,
    showTrashed = false,
    campaignStage,
    investorId = undefined,
  }) {
    const whereConditions = {};

    if (!!campaignStage) {
      if (campaignStage === CampaignStage.FUNDED) {
        const FundedStages = [CampaignStage.FUNDED, CampaignStage.EARLY_COMPLETE];

        whereConditions['campaignStage'] = {
          [Op.in]: FundedStages,
          [Op.notIn]: [CampaignStage.NOT_FUNDED, CampaignStage.PENDING_REFUNDS],
        };
      } else {
        whereConditions['campaignStage'] = filterUndefined({
          [Op.eq]: campaignStage,
          [Op.notIn]: [CampaignStage.NOT_FUNDED, CampaignStage.PENDING_REFUNDS],
        });
      }
    } else {
      whereConditions['campaignStage'] = filterUndefined({
        [Op.notIn]: [CampaignStage.NOT_FUNDED, CampaignStage.PENDING_REFUNDS],
      });
    }

    let includes;
    if (investorId) {
      includes = [
        {
          model: CampaignModel,
          as: 'campaign',
          where: whereConditions,
          attributes: ['campaignId', 'campaignName', 'issuerId', 'campaignStage'],
          include: [
            {
              model: IssuerModel,
              as: 'issuer',
              attributes: ['issuerId', 'businessType'],
            },
            {
              model: InvestorModel,
              as: 'interestedInvestors',
              attributes: ['investorId'],
              where: {
                investorId,
              },
              required: false,
            },
          ],
        },
      ];
    } else {
      includes = [
        {
          model: CampaignModel,
          as: 'campaign',
          where: whereConditions,
          attributes: ['campaignName', 'campaignStage'],
          include: [
            {
              model: IssuerModel,
              as: 'issuer',
              attributes: ['issuerId', 'businessType'],
            },
          ],
        },
      ];
    }

    return await super.fetchAll({
      paginationOptions,
      showTrashed,
      order: [['createdAt', 'asc']],
      includes: includes,
    });
  }

  async fetchByCampaign(campaignId, paginationOptions, showTrashed = false) {
    const includes = [
      {
        model: CampaignModel,
        as: 'campaign',
        where: { [Op.or]: {
          campaignId,
          slug: campaignId,
      } 
    },
        attributes: ['campaignName', 'issuerId', 'campaignStage'],
      },
    ];

    return await super.fetchAll({
      paginationOptions,
      showTrashed,
      order: [['createdAt', 'desc']],
      includes: includes,
    });
  }
}

export default CampaignOwnerStoryRepository;
