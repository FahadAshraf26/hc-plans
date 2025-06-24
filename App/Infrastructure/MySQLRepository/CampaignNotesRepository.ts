import Models from '../Model';
import { injectable } from 'inversify';
import CampaignNotes from '@domain/Core/CampaignNotes/CampaignNotes';
import BaseRepository from './BaseRepository';
import { ICampaignNotesRepository } from '@domain/Core/CampaignNotes/ICampaignNotesRepository';

const { CampaignNotesModel } = Models;

@injectable()
class CampaignNotesRepository extends BaseRepository implements ICampaignNotesRepository {
  constructor() {
    super(CampaignNotesModel, 'campaignNotesId', CampaignNotes);
  }

  /**
   * Fetch all campaignNotess from database with pagination
   * @returns {CampaignNotes[]}
   * @param paginationOptions
   * @param showTrashed
   */
  async fetchAll({ paginationOptions, showTrashed = false }) {
    return await super.fetchAll({
      paginationOptions,
      showTrashed,
    });
  }

  /**
   * Fetch all campaignNotess from database by Campaign with pagination
   * @returns {CampaignNotes[]}
   * @param campaignId
   * @param paginationOptions
   * @param showTrashed
   */
  async fetchByCampaign(campaignId, paginationOptions, showTrashed = false) {
    return await super.fetchAll({
      paginationOptions,
      showTrashed,
      whereConditions: { campaignId },
    });
  }
}

export default CampaignNotesRepository;
