import { ICampaignQARepository } from '@domain/Core/CampaignQA/ICampaignQARepository';
import { injectable } from 'inversify';

import models from '../Model';
const {
  CampaignQAModel,
  UserModel,
  ProfilePicModel,
  OwnerModel,
  CampaignModel,
  InvestorModel,
  Sequelize,
} = models;
const { Op } = Sequelize;

import CampaignQA from '../../Domain/Core/CampaignQA/CampaignQA';
import PaginationData from '../../Domain/Utils/PaginationData';
import BaseRepository from './BaseRepository';
import DatabaseError from '../Errors/DatabaseError';

@injectable()
class CampaignQARepository extends BaseRepository implements ICampaignQARepository {
  constructor() {
    super(CampaignQAModel, 'campaignQAId', CampaignQA);
  }

  /**
   *
   * @param options
   */
  async fetchAll(options): Promise<any> {
    try {
      const { paginationOptions, showTrashed = false } = options;
      const includes = [
        {
          model: CampaignQAModel,
          as: 'children',
        },
      ];

      const { count, rows: all } = await super.fetchAll({
        paginationOptions,
        showTrashed,
        whereConditions: { parentId: null },
        includes,
        raw: true,
      });

      const paginationData = new PaginationData(paginationOptions, count);

      all.forEach((campaignQAObj) => {
        const campaignQA = CampaignQA.createFromObject(campaignQAObj);

        campaignQAObj.children.forEach((campaignQAChildObj) => {
          const campaignQAChild = CampaignQA.createFromObject(campaignQAChildObj);
          campaignQA.setChild(campaignQAChild);
        });

        paginationData.addItem(campaignQA);
      });

      return paginationData;
    } catch (error) {
      throw new DatabaseError(error);
    }
  }

  /**
   * Fetch all questions/Answers for a campaign
   * @param {string} campaignId
   * @param {object} paginationOptions
   * @param {boolean} showTrashed
   */
  async fetchByCampaign(campaignId, paginationOptions, showTrashed): Promise<any> {
    try {
      const includes = [
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
        {
          model: CampaignQAModel,
          as: 'children',
          include: [
            {
              model: UserModel,
              as: 'user',
              attributes: ['userId', 'firstName', 'lastName'],
              include: [
                {
                  model: ProfilePicModel,
                  as: 'profilePic',
                },
                {
                  model: OwnerModel,
                  as: 'owner',
                  attributes: ['ownerId', 'title'],
                },
                {
                  model: InvestorModel,
                  as: 'investor',
                  attributes: ['investorId'],
                },
              ],
            },
          ],
        },
        {
          model: UserModel,
          as: 'user',
          attributes: ['userId', 'firstName', 'lastName'],
          include: [
            {
              model: ProfilePicModel,
              as: 'profilePic',
            },
            {
              model: OwnerModel,
              as: 'owner',
              attributes: ['ownerId', 'title'],
            },
            {
              model: InvestorModel,
              as: 'investor',
              attributes: ['investorId'],
            },
          ],
          paranoid: false,
        },
      ];

      const { count, rows: all } = await super.fetchAll({
        paginationOptions,
        showTrashed,
        whereConditions: { parentId: null },
        raw: true,
        order: [
          ['createdAt', 'DESC'],
          [{ model: CampaignQAModel, as: 'children' }, 'createdAt', 'ASC'],
        ],
        includes,
      });

      const paginationData = new PaginationData(paginationOptions, count);

      all.forEach((campaignQAObj) => {
        const campaignQA = CampaignQA.createFromObject(campaignQAObj);
        campaignQAObj.children.forEach((campaignQAChildObj) => {
          const campaingQAChild = CampaignQA.createFromObject(campaignQAChildObj);
          campaignQA.setChild(campaingQAChild);
        });

        paginationData.addItem(campaignQA);
      });

      return paginationData;
    } catch (error) {
      throw new DatabaseError(error);
    }
  }

  /**
   * Fetch all questions/Answers by parent
   * @param {*} campaignId
   * @param {*} page
   * @param {*} showTrashed
   */
  async fetchChildrenByCampaign(campaignId, paginationOptions, showTrashed) {
    try {
      return await super.fetchAll({
        whereConditions: { campaignId },
        paginationOptions,
        showTrashed,
      });
    } catch (error) {
      throw Error(error);
    }
  }

  async fetchByUser(userId, paginationOptions, showTrashed = false) {
    return await super.fetchAll({
      include: [
        {
          model: CampaignModel,
          required: true,
          attributes: ['campaignName'],
        },
      ],
      whereConditions: { userId },
      paginationOptions,
      showTrashed,
    });
  }

  /**
   * fetchById(campaignQAId) fetch campaignQA By Id
   * @param {string} campaignQAId
   * @returns {Object}
   */
  async fetchById(campaignQAId) {
    const includes = [{ model: CampaignQAModel, as: 'children' }];

    const campaignQAObj = await super.fetchById(campaignQAId, { includes, raw: true });

    const campaignQA = CampaignQA.createFromObject(campaignQAObj);

    campaignQAObj.children.forEach((campaignQAChildObj) => {
      const campaingQAChild = CampaignQA.createFromObject(campaignQAChildObj);
      campaignQA.setChild(campaingQAChild);
    });

    return campaignQA;
  }

  async fetchQACountByCampaign(campaignId) {
    try {
      const campaignQACount = await CampaignQAModel.count({
        where: { campaignId },
      });

      return campaignQACount || 0;
    } catch (e) {
      throw Error(e);
    }
  }

  async fetchQACountByInvestor(userId) {
    try {
      const campaignQACount = await CampaignQAModel.count({
        where: { userId },
      });

      return campaignQACount || 0;
    } catch (e) {
      throw Error(e);
    }
  }
}

export default CampaignQARepository;
