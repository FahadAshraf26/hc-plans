import models from '../Model';
import CampaignTag from '../../Domain/Core/CampaignTag/CampaignTag';
import BaseRepository from './BaseRepository';
import { injectable } from 'inversify';
import { ICampaignTagRepository } from '../../Domain/Core/CampaignTag/ICampaignTagRepository';
import PaginationData from '../../Domain/Utils/PaginationData';

const { CampaignTagModel, TagModel, CampaignModel, Sequelize } = models;
const { Op } = Sequelize;

@injectable()
class CampaignTagRepository extends BaseRepository implements ICampaignTagRepository {
  constructor() {
    super(CampaignTagModel, 'campaignTagId', CampaignTag);
  }

  /**
   *  Store campaignTag in database
   * @param {CampaignTag} campaignTag
   * @returns boolean
   */
  async add({ campaignId, campaignTags }) {
    try {
      await this.remove(campaignId, true);
      campaignTags.map(async (campaignTag) => await super.add(campaignTag));
      return true;
    } catch (error) {
      throw Error(error);
    }
  }

  /**
   *
   * @param {string} campaignId
   * @param {object} paginationOptions
   * @param {boolean} showTrashed
   */
   async getByCampaign(campaignId, paginationOptions, showTrashed) {
    const includes = [
      {
        model: TagModel,
        as: 'tag',
      },
      {
        model:CampaignModel,required:true,attributes:[], where: {
          [Op.or]: {
              campaignId,
              slug: campaignId,
          }
      },
      }
    ];

    return await super.fetchAll({
      paginationOptions,
      showTrashed,
      includes,
    });
  }

  /**
   * fetchById(campaignTagId) fetch campaignTag By Id
   * @param {string} campaignTagId
   * @returns Object
   */
  async fetchById(campaignTagId) {
    const includes = [
      {
        model: TagModel,
        as: 'tag',
      },
    ];

    return await super.fetchById(campaignTagId, { includes });
  }

  async fetchByTagId(tagId) {
    const campaignTag = await CampaignTagModel.findOne({
      where: { tagId },
      includes: [{ model: TagModel, as: 'tag' }]
    })

    if (!campaignTag) {
      return
    }

    return CampaignTag.createFromObject(campaignTag)
  }

  /**
   *
   * @param {CampaignTag} campaignTag
   * @returns boolean
   */
  async upsert(campaignTag) {
    try {
      const campaignTagObj = await super.fetchById(campaignTag.campaignTagId);

      if (campaignTagObj) {
        return await super.update(campaignTag);
      }

      return await super.add(campaignTag);
    } catch (error) {
      throw Error(error);
    }
  }

  /**
   * remove(campaignTagId) fetch campaignTag by id and delete it from database
   * @returns boolean
   * @param campaignTagObj
   * @param hardDelete
   */
  async remove(campaignId, hardDelete = false) {
    try {
      await CampaignTagModel.destroy({
        where: { campaignId },
        force: hardDelete,
      });

      return true;
    } catch (error) {
      throw Error(error);
    }
  }

  async removeByTagId(tagId, hardDelete = false) {
    try {
      await CampaignTagModel.destroy({
        where: { tagId },
        force: hardDelete
      })
      return true
    } catch (err) {
      throw Error(err)
    }
  }

  async removeByTagCampaign(tag, campaign, hardDelete = false) {
    try {
      await CampaignTagModel.destroy({
        where: { tagId: tag.tagId, campaignId: campaign.campaignId },
        force: hardDelete,
      });

      return true;
    } catch (error) {
      throw Error(error);
    }
  }
}

export default CampaignTagRepository;
