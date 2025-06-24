import PaginationData from '@domain/Utils/PaginationData';
import BaseRepository from './BaseRepository';
import CampaignNewsReport from '../../Domain/Core/CampaignNewsReport/CampaignNewsReport';
import { ICampaignNewsReportRepository } from '@domain/Core/CampaignNewsReport/ICampaignNewsReportRepository';
import { injectable } from 'inversify';
import models from '../Model';
const { CampaignNewsReportModel } = models;

@injectable()
class CampaignNewsReportRepository extends BaseRepository
  implements ICampaignNewsReportRepository {
  constructor() {
    super(CampaignNewsReportModel, 'campaignNewsReportId', CampaignNewsReport);
  }

  /**
   * Fetch all campaignNewsReports from database with pagination
   * @returns CampaignNewsReport[]
   * @param options
   */
  async fetchAll(options): Promise<PaginationData<CampaignNewsReport>> {
    const { paginationOptions, showTrashed = false } = options;
    return super.fetchAll({
      paginationOptions,
      showTrashed,
    });
  }

  /**
   * Fetch all campaignNewsReports from database with pagination
   * @returns CampaignNewsReport[]
   * @param campaignNewsId
   * @param options
   */
  async fetchByCampaignNews(
    campaignNewsId,
    options,
  ): Promise<PaginationData<CampaignNewsReport>> {
    const { paginationOptions, showTrashed = false } = options;
    return super.fetchAll({
      whereConditions: { campaignNewsId },
      paginationOptions,
      showTrashed,
    });
  }

  async fetchCountByCampaignNews(campaignNewsId, showTrashed = false): Promise<number> {
    try {
      const count = await CampaignNewsReportModel.count({
        where: { campaignNewsId },
        paranoid: !showTrashed, // paranoid: true  => hide delete , paranoid: false => show delete
      });

      return count || 0;
    } catch (e) {
      throw Error(e);
    }
  }
}

export default CampaignNewsReportRepository;
