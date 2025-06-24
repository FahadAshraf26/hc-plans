import models from '../Model';
import CampaignMedia from '@domain/Core/CamapignMedia/CampaignMedia';
import Investor from '@domain/Core/Investor/Investor';
import { inject, injectable } from 'inversify';
import Campaign from '@domain/Core/Campaign/Campaign';
import PaginationData from '@domain/Utils/PaginationData';
import filterUndefined from '../Utils/filterUndefined';
import { ChargeStatus } from '@domain/Core/ValueObjects/ChargeStatus';
import { CampaignStage } from '@domain/Core/ValueObjects/CampaignStage';
import User from '@domain/Core/User/User';
import BaseRepository from './BaseRepository';
import CampaignFundMap from '@domain/Core/CampaignFunds/CampaignFundMap';
import { ICampaignRepository } from '@domain/Core/Campaign/ICampaignRepository';
import 'reflect-metadata';
import searchStates from '@infrastructure/Utils/campaignSearch';
import sequelize from '@infrastructure/Database/mysqlConnection';
import { CampaignEscrow } from '@domain/Core/ValueObjects/CampaignEscrow';
import DatabaseError from '@infrastructure/Errors/DatabaseError';
import {
  ICampaignMediaRepository,
  ICampaignMediaRepositoryId,
} from '@domain/Core/CamapignMedia/ICampaignMediaRepository';
import {
  ICampaignRoughBudgetRepository,
  ICampaignRoughBudgetRepositoryId,
} from '@domain/Core/CampaignRoughBudget/ICampaignRoughBudgetRepository';
import PaginationOptions from '@domain/Utils/PaginationOptions';
import { QueryTypes } from 'sequelize';

const {
  CampaignModel,
  InvestorModel,
  CampaignEscrowBankModel,
  CampaignMediaModel,
  IssuerModel,
  IssuerBankModel,
  OwnerModel,
  UserModel,
  CampaignInfoModel,
  ProfilePicModel,
  CampaignFundModel,
  ChargeModel,
  EmployeeModel,
  RoughBudgetModel,
  CampaignAddressModel,
  InvestorPaymentsModel,
  Sequelize,
  RepaymentModel,
  TagModel,
  CampaignTagModel,
} = models;
const { Op, literal, fn, col } = Sequelize;
type successfulCampaignOptions = {
  ignoreCampaignStage?: boolean;
  campaignStage?: string;
  includePendingCharges?: boolean;
};

@injectable()
class CampaignRepository extends BaseRepository implements ICampaignRepository {
  constructor(
    @inject(ICampaignMediaRepositoryId)
    private campaignMediaRepository: ICampaignMediaRepository,
    @inject(ICampaignRoughBudgetRepositoryId)
    private campaignRoughBudgetRepository: ICampaignRoughBudgetRepository,
  ) {
    super(CampaignModel, 'campaignId', Campaign);
  }

  async fetchActiveCampaigns(): Promise<Campaign> {
    const rawCampaigns = CampaignModel.findAll({
      where: {
        campaignStage: CampaignStage.FUNDRAISING,
      },
      attributes: ['campaignId', 'issuerId', 'campaignName', 'campaignStage'],
      include: [
        {
          model: CampaignEscrowBankModel,
          as: 'campaignEscrow',
          required: true,
        },
      ],
    });

    return rawCampaigns.map((campaignObj) => {
      if (!!campaignObj.campaignEscrow.decrypt) {
        campaignObj.campaignEscrow.decrypt();
      }
      return Campaign.createFromObject(campaignObj);
    });
  }

  async fetchAllCampaignNames(): Promise<string[]> {
    const campaignNames = await CampaignModel.findAll({
      attributes: ['campaignName'],
    });

    return campaignNames.map((campaign) => campaign.campaignName);
  }

  /**
   * Fetch all campaigns from database with pagination
   * @param {PaginationOptions} paginationOptions
   * @param options
   * @returns Campaign[]
   */
  async fetchAll({ paginationOptions, options }): Promise<any> {
    const { showTrashed = false, campaignStage, showFailed, search, tags = [] } = options;
    let processedSearch = search;
    if (search && search.includes("'s")) {
      processedSearch = search.replace(/'s/g, "('s|s)?");
    }
    let whereConditions: any = {};
    if (!!campaignStage) {
      if (campaignStage === CampaignStage.FUNDED) {
        const FundedStages = [CampaignStage.FUNDED, CampaignStage.EARLY_COMPLETE];
        whereConditions.campaignStage = {
          [Op.in]: FundedStages,
          [Op.notIn]: !showFailed
            ? [CampaignStage.NOT_FUNDED, CampaignStage.PENDING_REFUNDS]
            : [],
        };
      } else {
        whereConditions.campaignStage = filterUndefined({
          [Op.eq]: campaignStage,
          [Op.notIn]: !showFailed
            ? [CampaignStage.NOT_FUNDED, CampaignStage.PENDING_REFUNDS]
            : undefined,
        });
      }
    } else if (!showFailed) {
      whereConditions.campaignStage = {
        [Op.in]: [
          CampaignStage.FUNDRAISING,
          CampaignStage.FUNDED,
          CampaignStage.FULLY_REPAID,
        ],
      };
    }
    let parsedTags = [];
    if (tags) {
      parsedTags = tags;
      if (typeof tags === 'string') {
        parsedTags = JSON.parse(tags);
      }
    }

    const tagArray = Array.isArray(parsedTags)
      ? parsedTags
      : [parsedTags].filter(Boolean);

    const includes: any[] = [
      {
        model: CampaignAddressModel,
        as: 'campaignAddress',
        required: false,
      },
      {
        model: IssuerModel,
        as: 'issuer',
        attributes: [
          'issuerId',
          'email',
          'issuerName',
          'businessType',
          'legalEntityType',
          'physicalAddress',
          'city',
          'state',
          'zipCode',
          'latitude',
          'longitude',
          'website',
          'country',
          'facebook',
          'linkedIn',
          'instagram',
          'twitter',
          'pinterest',
          'reddit',
          'ncIssuerId',
          'createdAt',
          'updatedAt',
        ],
        required: true,
      },
    ];

    if (tagArray.length > 0 || search) {
      const tagWhere: any = {
        deletedAt: null,
      };

      if (tagArray.length > 0) {
        tagWhere.tag = { [Op.in]: tagArray };
      }

      includes.push({
        model: TagModel,
        as: 'tags',
        through: {
          model: CampaignTagModel,
          attributes: [],
          where: {
            deletedAt: null,
          },
        },
        where: tagWhere,
        required: tagArray.length > 0,
      });
    }
    const statesCode = searchStates(search);
    const distinctCampaigns = await CampaignModel.sequelize.query(
      `SELECT DISTINCT campaign.campaignId, campaign.campaignStage, campaign.createdAt
       FROM campaigns AS campaign
       LEFT OUTER JOIN campaignAddresses AS campaignAddress
         ON campaign.campaignId = campaignAddress.campaignId
       INNER JOIN issuers AS issuer
         ON campaign.issuerId = issuer.issuerId
         AND issuer.deletedAt IS NULL
       ${
         search || tagArray.length > 0
           ? `
       LEFT OUTER JOIN campaignTags AS \`tags->campaignTag\`
         ON campaign.campaignId = \`tags->campaignTag\`.campaignId
         AND \`tags->campaignTag\`.deletedAt IS NULL
       LEFT OUTER JOIN tags AS tags
         ON tags.tagId = \`tags->campaignTag\`.tagId
         AND tags.deletedAt IS NULL
       `
           : ''
       }
       WHERE campaign.deletedAt IS NULL
       ${
         whereConditions.campaignStage
           ? `AND campaign.campaignStage IN (${
               Array.isArray(whereConditions.campaignStage[Op.in])
                 ? whereConditions.campaignStage[Op.in]
                     .map((stage) => `'${stage}'`)
                     .join(',')
                 : `'${whereConditions.campaignStage[Op.eq]}'`
             })`
           : ''
       }
       ${
         search
           ? `
       AND (
         campaign.campaignName REGEXP :search OR
         issuer.zipCode REGEXP :search OR
         issuer.city REGEXP :search OR
         issuer.physicalAddress REGEXP :search OR
         campaignAddress.address REGEXP :search OR
         campaignAddress.zipCode REGEXP :search OR
         campaignAddress.city REGEXP :search OR
         tags.tag REGEXP :search OR
         ${
           statesCode.length
             ? `
         issuer.state IN (${statesCode.map((code) => `'${code}'`).join(',')}) OR
         campaignAddress.state IN (${statesCode.map((code) => `'${code}'`).join(',')})
         `
             : 'FALSE'
         }
       )
       `
           : 'AND campaign.isShowOnExplorePage = true'
       }
       ${
         tagArray.length > 0
           ? `
       AND tags.tag IN (${tagArray.map((tag) => `'${tag}'`).join(',')})
       `
           : ''
       }
       ORDER BY FIELD(campaign.campaignStage,
         '${CampaignStage.FUNDRAISING}',
         '${CampaignStage.COMING_SOON}',
         '${CampaignStage.FUNDED}',
         '${CampaignStage.EARLY_COMPLETE}',
         '${CampaignStage.NOT_FUNDED}',
         '${CampaignStage.ONBOARDING}',
         '${CampaignStage.QUALIFIED_LEADS}',
         '${CampaignStage.LEADS}',
         '${CampaignStage.FULLY_REPAID}'
       ), campaign.createdAt DESC`,
      {
        type: QueryTypes.SELECT,
        raw: true,
        replacements: {
          search: processedSearch,
        },
      },
    );

    const count = distinctCampaigns.length;

    const campaignIds = distinctCampaigns.map((campaign) => campaign.campaignId);

    const paginatedIds = campaignIds.slice(
      paginationOptions.offset(),
      paginationOptions.offset() + paginationOptions.limit(),
    );

    if (paginatedIds.length === 0) {
      return new PaginationData(paginationOptions, 0);
    }

    const all = await CampaignModel.findAll({
      where: {
        campaignId: {
          [Op.in]: paginatedIds,
        },
      },
      include: includes,
      paranoid: !showTrashed,
      order: [
        [
          literal(
            `Field(campaignStage,'${CampaignStage.FUNDRAISING}','${CampaignStage.COMING_SOON}','${CampaignStage.FUNDED}', '${CampaignStage.EARLY_COMPLETE}', '${CampaignStage.NOT_FUNDED}','${CampaignStage.ONBOARDING}','${CampaignStage.QUALIFIED_LEADS}','${CampaignStage.LEADS}','${CampaignStage.FULLY_REPAID}')`,
          ),
        ],
        ['createdAt', 'desc'],
      ],
    });

    const paginationData = new PaginationData(paginationOptions, count);
    await Promise.all(
      all.map(async (campaignObj) => {
        let campaign = Campaign.createFromObject(campaignObj);
        const campaignMedia = await this.campaignMediaRepository.fetchAllByCampaignId(
          campaign.CampaignId(),
        );
        const campaignRoughBudget = await this.campaignRoughBudgetRepository.fetchByCampaign(
          campaign.CampaignId(),
        );
        if (campaignMedia) {
          const campaignMediaSorted = campaignMedia.sort(function (a, b) {
            return a.position - b.position;
          });
          for (const mediaObj of campaignMediaSorted) {
            const media = CampaignMedia.createFromObject(mediaObj);
            campaign.setMedia(media);
          }
          if (campaignObj.interestedInvestors) {
            for (const interestedInvestorObj of campaignObj.interestedInvestors) {
              const interestedInvestor = Investor.createFromObject(interestedInvestorObj);
              campaign.setInterestedInvestor(interestedInvestor);
            }
          }
        }
        if (campaignMedia.length && Object.values(campaignRoughBudget).length) {
          paginationData.addItem(campaign);
        }
      }),
    );

    return paginationData;
  }

  async fetchAllCampaigns(): Promise<any> {
    let whereIssuerCondition: any = {};
    let whereConditions: any = {};
    const includes: any[] = [
      {
        model: IssuerModel,
        as: 'issuer',
        where: whereIssuerCondition,
        distinct: true,
      },
    ];
    const { count, rows: all } = await CampaignModel.findAndCountAll({
      where: whereConditions,
      include: includes,
    });

    const campaigns = [];
    await Promise.all(
      all.map(async (campaignObj) => {
        let campaign = Campaign.createFromObject(campaignObj);
        campaigns.push(campaign);
      }),
    );

    return campaigns;
  }

  async fetchAllForAdmin({ paginationOptions, options }): Promise<any> {
    const {
      showTrashed = false,
      campaignStage,
      showFailed,
      investorId = undefined,
      isAdminRequest = false,
      search,
      sortBy,
      sortPriority,
    } = options;
    let whereIssuerCondition: any = {};
    if (search) {
      const statesCode = searchStates(search);
      whereIssuerCondition = {
        [Op.or]: {
          zipCode: { [Op.like]: `%${search}%` },
          '$campaign.campaignName$': { [Op.like]: `%${search}%` },
          city: { [Op.like]: `%${search}%` },
          state: { [Op.in]: statesCode },
          physicalAddress: { [Op.like]: `%${search}%` },
          '$campaignAddress.address$': { [Op.like]: `%${search}%` },
          '$campaignAddress.zipCode$': { [Op.like]: `%${search}%` },
          '$campaignAddress.city$': { [Op.like]: `%${search}%` },
          '$campaignAddress.state$': { [Op.in]: statesCode },
        },
      };
    }
    let whereConditions: any = {};
    if (!!campaignStage) {
      if (campaignStage === CampaignStage.FUNDED) {
        const FundedStages = [CampaignStage.FUNDED, CampaignStage.EARLY_COMPLETE];

        whereConditions.campaignStage = {
          [Op.in]: FundedStages,
          [Op.notIn]: !showFailed
            ? [CampaignStage.NOT_FUNDED, CampaignStage.PENDING_REFUNDS]
            : [],
        };
      } else {
        whereConditions.campaignStage = filterUndefined({
          [Op.eq]: campaignStage,
          [Op.notIn]: !showFailed
            ? [CampaignStage.NOT_FUNDED, CampaignStage.PENDING_REFUNDS]
            : undefined,
        });
      }
    } else if (!showFailed) {
      whereConditions.campaignStage = filterUndefined({
        [Op.notIn]: [CampaignStage.PENDING_REFUNDS],
      });
    }

    const includes: any[] = [
      {
        model: CampaignAddressModel,
        as: 'campaignAddress',
        required: false,
      },
      {
        model: IssuerModel,
        as: 'issuer',
        where: whereIssuerCondition,
        distinct: true,
      },
    ];

    const { count, rows: all } = await CampaignModel.findAndCountAll({
      where: whereConditions,
      limit: paginationOptions.limit(),
      offset: paginationOptions.offset(),
      include: includes,
      paranoid: !showTrashed,
      order: [
        ...(sortBy && sortPriority
          ? [[literal(`CASE WHEN campaignStage = '${sortPriority}' THEN 0 ELSE 1 END`)]]
          : []),
        [
          literal(
            `Field(campaignStage,'${CampaignStage.FUNDRAISING}','${CampaignStage.COMING_SOON}','${CampaignStage.FUNDED}', '${CampaignStage.EARLY_COMPLETE}', '${CampaignStage.NOT_FUNDED}','${CampaignStage.ONBOARDING}','${CampaignStage.QUALIFIED_LEADS}','${CampaignStage.LEADS}','${CampaignStage.FULLY_REPAID}','${CampaignStage.DEFAULTED}','${CampaignStage.MODIFIED}')`,
          ),
        ],
        ['createdAt', 'desc'],
      ],
    });

    const paginationData = new PaginationData(paginationOptions, count);

    for (const campaignObj of all) {
      let campaign = Campaign.createFromObject(campaignObj);

      paginationData.addItem(campaign);
    }
    return paginationData;
  }

  /**
   * get all campaigns by issuerId
   * @param {string} issuerId
   * @param paginationOptions
   * @param {boolean} showTrashed
   */
  async fetchByIssuerId(issuerId, paginationOptions, showTrashed = false): Promise<any> {
    const includes = [
      {
        model: InvestorModel,
        as: 'interestedInvestors',
        attributes: ['investorId'],
      },
      {
        model: CampaignMediaModel,
        as: 'campaignMedia',
      },
    ];

    const { count, rows: all } = await super.fetchAll({
      whereConditions: { issuerId },
      paginationOptions,
      showTrashed,
      includes,
      raw: true,
    });

    const paginationData = new PaginationData(paginationOptions, count);

    for (const campaignObj of all) {
      const campaign = Campaign.createFromObject(campaignObj);
      for (const mediaObj of campaignObj.campaignMedia) {
        const media = CampaignMedia.createFromObject(mediaObj);
        campaign.setMedia(media);
      }
      for (const interestedInvestorObj of campaignObj.interestedInvestors) {
        const interestedInvestor = Investor.createFromObject(interestedInvestorObj);
        campaign.setInterestedInvestor(interestedInvestor);
      }

      paginationData.addItem(campaign);
    }

    return paginationData;
  }

  async getFavoriteCampaign(
    investorId,
    paginationOptions,
    showTrashed = false,
  ): Promise<any> {
    const includes = [
      {
        model: IssuerModel,
        as: 'issuer',
        attributes: ['businessType', 'legalEntityType', 'city', 'state'],
      },
      {
        model: CampaignMediaModel,
        as: 'campaignMedia',
      },
      {
        model: InvestorModel,
        as: 'interestedInvestors',
        where: { investorId },
        required: true,
        attributes: ['investorId', 'userId'],
      },
      {
        model: CampaignAddressModel,
        as: 'campaignAddress',
      },
    ];

    const { count, rows: all } = await super.fetchAll({
      paginationOptions,
      showTrashed,
      includes,
      attributes: [
        'campaignId',
        'slug',
        'issuerId',
        'campaignName',
        'campaignStage',
        'campaignStartDate',
        'campaignDuration',
        'campaignMinimumAmount',
        'annualInterestRate',
        'summary',
        'campaignTargetAmount',
        'investmentType',
        'campaignEndTime',
        'campaignTimezone',
      ],
      raw: true,
    });

    const paginationData = new PaginationData(paginationOptions, count);
    for (const campaignObj of all) {
      const campaign = Campaign.createFromObject(campaignObj);
      for (const mediaObj of campaignObj.campaignMedia) {
        const media = CampaignMedia.createFromObject(mediaObj);
        campaign.setMedia(media);
      }
      for (const interestedInvestorObj of campaignObj.interestedInvestors) {
        const interestedInvestor = Investor.createFromObject(interestedInvestorObj);
        campaign.setInterestedInvestor(interestedInvestor);
      }

      paginationData.addItem(campaign);
    }
    return paginationData;
  }

  /**
   * fetchById(campaignId) fetch campaign By Id
   * @param {string} campaignId
   * @param isAdminRequest
   * @returns {Campaign}
   */
  async fetchById(
    campaignId,
    isAdminRequest = false,
    investorId = undefined,
  ): Promise<Campaign> {
    if (campaignId.endsWith('.')) {
      campaignId = campaignId.slice(0, -1);
    }
    const includes: any[] = isAdminRequest
      ? []
      : [
          {
            model: IssuerModel,
            as: 'issuer',
            attributes: [
              'issuerId',
              'email',
              'issuerName',
              'businessType',
              'legalEntityType',
              'physicalAddress',
              'city',
              'state',
              'zipCode',
              'latitude',
              'longitude',
              'website',
              'country',
              'facebook',
              'linkedIn',
              'instagram',
              'twitter',
              'pinterest',
              'reddit',
              'ncIssuerId',
              'createdAt',
              'updatedAt',
            ],
            include: [
              {
                model: EmployeeModel,
                as: 'employees',
              },
              {
                model: OwnerModel,
                as: 'owners',
                include: [
                  {
                    model: UserModel,
                    as: 'user',
                    attributes: [
                      'userId',
                      'firstName',
                      'lastName',
                      'email',
                      'website',
                      'facebook',
                      'linkedIn',
                      'instagram',
                      'twitter',
                    ],
                    include: [
                      {
                        model: ProfilePicModel,
                        attributes: ['profilePicId', 'path', 'mimeType'],
                        as: 'profilePic',
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            model: CampaignAddressModel,
            as: 'campaignAddress',
          },
        ];

    if (!!investorId) {
      includes.push({
        model: InvestorModel,
        as: 'interestedInvestors',
        attributes: ['investorId'],
        distinct: true,
      });
    }

    const campaignObj = await CampaignModel.findOne({
      where: {
        [Op.or]: {
          campaignId,
          slug: campaignId,
        },
      },
      include: includes,
      order: [
        [
          { model: IssuerModel, as: 'issuer' },
          { model: OwnerModel, as: 'owners' },
          'updatedAt',
          'ASC',
        ],
      ],
    });

    if (!campaignObj) {
      return null;
    }

    let campaign = Campaign.createFromObject(campaignObj);

    if (campaignObj.interestedInvestors) {
      for (const interestedInvestorObj of campaignObj.interestedInvestors) {
        const interestedInvestor = Investor.createFromObject(interestedInvestorObj);
        campaign.setInterestedInvestor(interestedInvestor);
      }
    }
    return campaign;
    // return super.fetchOneByCustomCritera({
    //   whereConditions: {
    //     [Op.or]: {
    //       campaignId,
    //       slug: campaignId,
    //     },
    //   },
    //   includes,
    // });
  }

  /**
   * fetch campaigns:
   * 1. are funded
   * 2. at least a month is passed since campaign expiration date
   * @param {} paginationOptions
   */
  async fetchSuccessfulCampaigns(): Promise<Array<Campaign>> {
    const all = await CampaignModel.findAll({
      where: {
        campaignStage: CampaignStage.FUNDED,
      },
      include: [
        {
          model: IssuerModel,
          as: 'issuer',
          where: {
            dwollaCustomerId: { [Op.ne]: null },
          },
          required: true,
        },

        {
          model: CampaignFundModel,
          as: 'campaignFunds',
          include: [
            {
              model: InvestorModel,
              as: 'campaignInvestor',
              required: true,
            },
            {
              model: ChargeModel,
              as: 'charge',
              where: {
                chargeStatus: ChargeStatus.SUCCESS,
                refunded: { [Op.or]: [null, false] },
              },
              required: true,
            },
          ],
        },
      ],
    });

    return all.map((campaignObj) => Campaign.createFromObject(campaignObj));
  }

  /**
   * fetch successful campaigns
   * @param {string} campaignId
   * @param {{ignoreCampaignStage?:boolean,campaignStage?:string}} options
   */
  async fetchSuccessfulCampaignById(
    campaignId,
    options: successfulCampaignOptions,
  ): Promise<Campaign> {
    const {
      ignoreCampaignStage = false,
      campaignStage = CampaignStage.FUNDED,
      includePendingCharges = false,
    } = options;

    const includes = [
      {
        model: IssuerModel,
        as: 'issuer',
        where: {
          dwollaCustomerId: { [Op.ne]: null },
        },
        required: true,
      },

      {
        model: CampaignFundModel,
        as: 'campaignFunds',
        include: [
          {
            model: InvestorModel,
            as: 'campaignInvestor',
            required: true,
          },
          {
            model: ChargeModel,
            as: 'charge',
            where: {
              chargeStatus: includePendingCharges
                ? { [Op.like]: '%%' }
                : ChargeStatus.SUCCESS,
              refunded: { [Op.or]: [null, false] },
            },
            required: true,
          },
        ],
      },
    ];

    const whereConditions: { campaignId: string; campaignStage?: any } = {
      campaignId,
      campaignStage,
    };

    if (!ignoreCampaignStage) {
      if (campaignStage === CampaignStage.FUNDED) {
        const FundedStages = [CampaignStage.FUNDED, CampaignStage.EARLY_COMPLETE];

        whereConditions.campaignStage = {
          [Op.in]: FundedStages,
        };
      } else {
        whereConditions.campaignStage = campaignStage;
      }
    }

    return super.fetchOneByCustomCritera({
      whereConditions,
      includes,
    });
  }

  async getOwnerCampaigns(userId, paginationOptions): Promise<any> {
    const includes = [
      {
        model: CampaignMediaModel,
        as: 'campaignMedia',
      },
      {
        model: IssuerModel,
        as: 'issuer',
        required: true,
        include: [
          {
            model: OwnerModel,
            as: 'owners',
            where: {
              userId: { [Op.eq]: userId },
            },
            required: true,
          },
        ],
      },
      {
        model: CampaignFundModel,
        as: 'campaignFunds',
        include: [
          {
            model: ChargeModel,
            as: 'charge',
            where: {
              chargeStatus: ChargeStatus.SUCCESS,
              refunded: { [Op.or]: [null, false] },
            },
            required: false,
          },
        ],
      },
    ];

    const { count, rows: all } = await CampaignModel.findAndCountAll({
      limit: paginationOptions.limit(),
      offset: paginationOptions.offset(),
      include: includes,
      order: [
        [
          literal(
            `CASE WHEN campaign.campaignStage = '${CampaignStage.NOT_FUNDED}' THEN 0 ELSE 1 END`,
          ),
          'DESC',
        ],
        [col('campaign.campaignExpirationDate'), 'DESC'],
      ],
    });

    const paginationData = new PaginationData(paginationOptions, all.length);
    for (const campaignObj of all) {
      if (campaignObj.campaignFunds) {
        campaignObj.campaignFunds = campaignObj.campaignFunds.map((fund) => {
          return CampaignFundMap.toDTO(CampaignFundMap.toDomain(fund));
        });
      }
      const campaign = Campaign.createFromObject(campaignObj);
      for (const mediaObj of campaignObj.campaignMedia) {
        const media = CampaignMedia.createFromObject(mediaObj);
        campaign.setMedia(media);
      }

      paginationData.addItem(campaign);
    }
    return paginationData;
  }

  async fetchByExpirationDate(
    date,
    {
      includeInterestedInvestor = false,
      campaignStage = false,
    }: {
      includeInterestedInvestor?: boolean;
      campaignStage?: any;
    },
  ): Promise<Array<Campaign>> {
    try {
      const all = await CampaignModel.findAll({
        where: literal(
          `Date(campaignExpirationDate) = '${date}' ${
            campaignStage ? `and campaignStage = '${campaignStage}'` : ''
          }`,
        ),
        include: includeInterestedInvestor
          ? [
              {
                model: InvestorModel,
                as: 'interestedInvestors',
                required: true,
                include: [
                  {
                    model: UserModel,
                    as: 'user',
                  },
                ],
              },
            ]
          : [],
      });

      return all.map((campaignObj) => {
        const campaign = Campaign.createFromObject(campaignObj);
        for (const interestedInvestorObj of campaignObj.interestedInvestors) {
          const interestedInvestor = Investor.createFromObject(interestedInvestorObj);
          if (interestedInvestorObj.user) {
            const user = User.createFromObject(interestedInvestorObj.user);
            interestedInvestor.setUser(user);
          }
          campaign.setInterestedInvestor(interestedInvestor);
        }
        return campaign;
      });
    } catch (err) {
      throw err;
    }
  }

  /**
   *
   * @param {{paginationOptions: PaginationOptions,showTrashed: boolean,campaignStage: string}} options
   */
  async fetchPublicOppurtunities(options): Promise<any> {
    try {
      const { paginationOptions, showTrashed = false, campaignStage } = options;
      const includes = [
        {
          model: CampaignMediaModel,
          as: 'campaignMedia',
        },
        {
          model: IssuerModel,
          as: 'issuer',
          attributes: ['businessType'],
        },
      ];
      const attributes = ['campaignName', 'campaignExpirationDate'];
      const whereConditions = {
        campaignStage: campaignStage,
        campaignExpirationDate: {
          [Op.gte]: new Date(),
        },
      };

      const { count, rows: all } = await super.fetchAll({
        paginationOptions,
        showTrashed,
        whereConditions,
        attributes,
        includes,
        raw: true,
      });

      const paginationData = new PaginationData(options.paginationOptions, count);

      for (const campaignObj of all) {
        const campaign = Campaign.createFromObject(campaignObj);
        for (const mediaObj of campaignObj.campaignMedia) {
          const media = CampaignMedia.createFromObject(mediaObj);
          campaign.setMedia(media);
        }

        paginationData.addItem(campaign);
      }
      return paginationData;
    } catch (err) {
      throw err;
    }
  }

  async fetchCampaignInfoById(campaignId): Promise<Campaign> {
    const includes = [
      {
        model: IssuerModel,
        as: 'issuer',
        include: [
          {
            model: OwnerModel,
            as: 'owners',
            include: [
              {
                model: UserModel,
                as: 'user',
                include: [
                  {
                    model: ProfilePicModel,
                    as: 'profilePic',
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        model: CampaignInfoModel,
        as: 'campaignInfo',
      },
    ];

    return super.fetchById(campaignId, { includes });
  }

  /**
   * fetchById(campaignId) fetch campaign By Id
   * @param {string} slug
   * @param isAdminRequest
   * @returns {Campaign}
   */
  async fetchBySlug(slug, isAdminRequest = false) {
    if (slug.endsWith('.')) {
      slug = slug.slice(0, -1);
    }
    const includes = isAdminRequest
      ? []
      : [
          {
            model: IssuerModel,
            as: 'issuer',
            attributes: [
              'issuerId',
              'email',
              'issuerName',
              'businessType',
              'legalEntityType',
              'physicalAddress',
              'city',
              'state',
              'zipCode',
              'latitude',
              'longitude',
              'website',
              'country',
              'facebook',
              'linkedIn',
              'instagram',
              'twitter',
              'pinterest',
              'reddit',
              'ncIssuerId',
              'createdAt',
              'updatedAt',
            ],
            include: [
              {
                model: EmployeeModel,
                as: 'employees',
              },
              {
                model: OwnerModel,
                as: 'owners',
                include: [
                  {
                    model: UserModel,
                    as: 'user',
                    attributes: [
                      'userId',
                      'firstName',
                      'lastName',
                      'email',
                      'website',
                      'facebook',
                      'linkedIn',
                      'instagram',
                      'twitter',
                    ],
                    include: [
                      {
                        model: ProfilePicModel,
                        attributes: ['profilePicId', 'path', 'mimeType'],
                        as: 'profilePic',
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            model: CampaignAddressModel,
            as: 'campaignAddress',
          },
        ];

    return await super.fetchOneByCustomCritera({ whereConditions: { slug }, includes });
  }

  async checkNameAvailbility(campaignName: string) {
    const campaign = await CampaignModel.findOne({ where: { campaignName } });
    if (!campaign) {
      return;
    }

    return Campaign.createFromObject(campaign);
  }

  async fetchAllByIssuerId(issuerId: string) {
    const campaigns = await CampaignModel.findAll({
      where: { issuerId },
    });

    return campaigns.map((item) => {
      return Campaign.createFromObject(item);
    });
  }

  async fetchAllCampaignTags() {
    return sequelize.query(
      ` select c.campaignId, c.campaignName,
        concat('[',
        group_concat(
          json_object('tag', t.tag)
        ),
        ']') as campaignTags
      from campaigns c
      join campaignTags ct on ct.campaignId = c.campaignId
      join tags t on t.tagId = ct.tagId
      group by c.campaignId`,
      {
        type: Sequelize.QueryTypes.SELECT,
      },
    );
  }

  async getAllFCCampaigns() {
    try {
      const result = await CampaignModel.findAll({
        where: {
          escrowType: { [Op.ne]: CampaignEscrow.NC_BANK },
        },
        attributes: ['campaignId', 'campaignName'],
      });

      return result;
    } catch (error) {
      throw new DatabaseError(error.message);
    }
  }

  async getCampaignsWithRepayments(search: string, paginationOptions: PaginationOptions) {
    try {
      const whereConditions = {
        campaignStage: {
          [Op.in]: [
            CampaignStage.EARLY_COMPLETE,
            CampaignStage.FUNDED,
            CampaignStage.MODIFIED,
            CampaignStage.DEFAULTED,
            CampaignStage.IN_INVESTOR_VOTE,
            CampaignStage.FUNDRAISING,
            CampaignStage.MATERIAL_CHANGE,
            CampaignStage.FULLY_REPAID,
            CampaignStage.SUCCESSFUL_FINALIZING,
          ],
        },
      };

      if (search) {
        const escapedSearch = search.replace(/'/g, "''");
        whereConditions[Op.or] = [
          { campaignName: { [Op.like]: `%${search}%` } },
          { campaignStage: { [Op.like]: `%${search}%` } },
          Sequelize.literal(
            `EXISTS (SELECT 1 FROM issuers WHERE issuers.issuerId = campaign.issuerId AND issuers.issuerName LIKE '%${escapedSearch}%')`,
          ),
        ];
      }

      const { count, rows: data } = await CampaignModel.findAndCountAll({
        where: whereConditions,
        include: [
          {
            model: IssuerModel,
            as: 'issuer',
            attributes: [],
          },
          {
            model: RepaymentModel,
            as: 'repayments',
            attributes: [],
          },
        ],
        attributes: [
          'campaignId',
          'campaignName',
          'updatedAt',
          'repaymentStartDate',
          'campaignStage',
          'issuer.issuerName',
          [
            Sequelize.fn('COUNT', Sequelize.col('repayments.repaymentId')),
            'repaymentCount',
          ],
        ],
        group: ['campaign.campaignId'],
        order: [['repaymentStartDate', 'ASC']],
        limit: paginationOptions.limit(),
        offset: paginationOptions.offset(),
        raw: true,
        subQuery: false,
      });
      const paginatedData = new PaginationData(paginationOptions, count.length);
      paginatedData.addItem(data);

      return paginatedData;
    } catch (error) {
      throw new DatabaseError(error.message);
    }
  }

  async getCampaignsWithProjectionReturns(
    search: string,
    paginationOptions: PaginationOptions,
  ) {
    try {
      const whereConditions = {
        campaignStage: {
          [Op.in]: [
            CampaignStage.EARLY_COMPLETE,
            CampaignStage.FUNDED,
            CampaignStage.MODIFIED,
            CampaignStage.DEFAULTED,
            CampaignStage.IN_INVESTOR_VOTE,
            CampaignStage.FUNDRAISING,
            CampaignStage.MATERIAL_CHANGE,
            CampaignStage.FULLY_REPAID,
            CampaignStage.SUCCESSFUL_FINALIZING,
          ],
        },
      };

      if (search) {
        const escapedSearch = search.replace(/'/g, "''");
        whereConditions[Op.or] = [
          { campaignName: { [Op.like]: `%${search}%` } },
          { campaignStage: { [Op.like]: `%${search}%` } },
          Sequelize.literal(
            `EXISTS (SELECT 1 FROM issuers WHERE issuers.issuerId = campaign.issuerId AND issuers.issuerName LIKE '%${escapedSearch}%')`,
          ),
        ];
      }

      const { count, rows: data } = await CampaignModel.findAndCountAll({
        where: whereConditions,
        include: [
          {
            model: IssuerModel,
            as: 'issuer',
            attributes: [],
          },
          {
            model: InvestorPaymentsModel,
            as: 'investorPayments',
            attributes: [],
          },
        ],
        attributes: [
          'campaignId',
          'campaignName',
          'updatedAt',
          'repaymentStartDate',
          'campaignStage',
          'issuer.issuerName',
          [
            Sequelize.fn('COUNT', Sequelize.col('investorPayments.investorPaymentsId')),
            'hasProjectionReturns',
          ],
        ],
        group: ['campaign.campaignId'],
        limit: paginationOptions.limit(),
        offset: paginationOptions.offset(),
        raw: true,
        subQuery: false,
      });
      const paginatedData = new PaginationData(paginationOptions, count.length);
      paginatedData.addItem(data);

      return paginatedData;
    } catch (error) {
      throw new DatabaseError(error.message);
    }
  }
}

export default CampaignRepository;
