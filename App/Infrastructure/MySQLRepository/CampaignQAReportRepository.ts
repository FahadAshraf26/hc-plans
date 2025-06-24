import { ICampaignQAReportRepository } from '@domain/Core/CampaignQAReport/ICampaignQAReportRepository';
import models from '../Model';
import CampaignQAReport from '../../Domain/Core/CampaignQAReport/CampaignQAReport';
import BaseRepository from './BaseRepository';
import PaginationData from '@domain/Utils/PaginationData';
import { injectable } from 'inversify';
const { CampaignQAReportModel } = models;

@injectable()
class CampaignQAReportRepository extends BaseRepository
  implements ICampaignQAReportRepository {
  constructor() {
    super(CampaignQAReportModel, 'campaignQAReportId', CampaignQAReport);
  }

  /**
   * Fetch all campaignQAReports from database with pagination
   * @returns CampaignQAReport[]
   * @param paginationOptions
   * @param options
   */
  async fetchAll(options): Promise<PaginationData<CampaignQAReport>> {
    const { paginationOptions, showTrashed = false } = options;
    return super.fetchAll({
      paginationOptions,
      showTrashed,
    });
  }

  /**
   * Fetch all campaignQAReports from database with pagination
   * @returns CampaignQAReport[]
   * @param campaignQAId
   * @param paginationOptions
   * @param options
   */
  async fetchByCampaignQA(
    campaignQAId,
    options,
  ): Promise<PaginationData<CampaignQAReport>> {
    const { paginationOptions, showTrashed = false } = options;
    return super.fetchAll({
      paginationOptions,
      showTrashed,
      whereConditions: { campaignQAId },
    });
  }

  async fetchCountByCampaignQA(campaignQAId, showTrashed = false): Promise<number> {
    try {
      const count = await CampaignQAReportModel.count({
        where: { campaignQAId },
        paranoid: !showTrashed, // paranoid: true  => hide delete , paranoid: false => show delete
      });

      return count || 0;
    } catch (e) {
      throw Error(e);
    }
  }
}

export default CampaignQAReportRepository;
