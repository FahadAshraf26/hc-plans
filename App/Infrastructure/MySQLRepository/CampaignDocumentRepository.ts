import { injectable } from 'inversify';
import models from '../Model';
import CampaignDocument from '@domain/Core/CampaignDocument/CampaignDocument';
import filterUndefined from '../Utils/filterUndefined';
import BaseRepository from './BaseRepository';
import { ICampaignDocumentRepository } from '@domain/Core/CampaignDocument/ICampaignDocumentRepository';
import PaginationData from '@domain/Utils/PaginationData';

const { CampaignDocumentModel, Sequelize } = models;
const { Op } = Sequelize;

@injectable()
class CampaignDocumentRepository extends BaseRepository
  implements ICampaignDocumentRepository {
  constructor() {
    super(CampaignDocumentModel, 'campaignDocumentId', CampaignDocument);
  }

  async fetchAll(options): Promise<PaginationData<CampaignDocument>> {
    const { paginationOptions, showTrashed = false } = options;
    return super.fetchAll({ paginationOptions, showTrashed });
  }

  /**
   * Fetch all questions/Answers for a campaign
   * @param {*} campaignId
   * @param paginationOptions
   * @param options
   */
  async fetchByCampaign(
    campaignId,
    paginationOptions,
    options,
  ): Promise<PaginationData<CampaignDocument>> {
    try {
      const { showTrashed = false, query } = options;

      const whereConditions = filterUndefined({
        name: query ? { [Op.like]: `%${query}%` } : undefined,
        campaignId: campaignId ? campaignId : undefined,
      });

      return super.fetchAll({ whereConditions, paginationOptions, showTrashed });
    } catch (error) {
      throw Error(error);
    }
  }

  async fetchByCampaignAndType(campaignId, type): Promise<CampaignDocument> {
    try {
      const document = await CampaignDocumentModel.findOne({
        where: { campaignId, documentType: type, deletedAt: null },
      });
      if (!document) {
        return null;
      }
      return CampaignDocument.createFromObject(document);
    } catch (err) {
      throw Error(err);
    }
  }

  async fetchDocumentCountByCampaignType(
    campaignId: string,
    campaignType: string,
  ): Promise<any> {
    try {
      return CampaignDocumentModel.count({
        where: { campaignId, documentType: campaignType },
      });
    } catch (err) {
      throw Error(err);
    }
  }
}

export default CampaignDocumentRepository;
