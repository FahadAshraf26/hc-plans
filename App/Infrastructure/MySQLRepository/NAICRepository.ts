import Models from '../Model';
import { INAICRepository } from '@domain/Core/NAIC/INAICRepository';
import NAIC from '@domain/Core/NAIC/NAIC';
import BaseRepository from './BaseRepository';
import { injectable } from 'inversify';

const { NaicModel, Sequelize } = Models;
const { Op } = Sequelize;

@injectable()
class NAICRepository extends BaseRepository implements INAICRepository {
  constructor() {
    super(NaicModel, 'naicId', NAIC);
  }

  /**
   * Fetch all naics from database with pagination
   * @returns NAIC[]
   * @param paginationOptions
   * @param query
   */
  async fetchAll({ paginationOptions, query }) {
    return await super.fetchAll({
      paginationOptions,
      whereConditions: query ? { title: { [Op.like]: `%${query}%` } } : {},
    });
  }
}

export default NAICRepository;
