import { IUncaughtExceptionRepository } from '@domain/Core/UncaughtException/IUncaughtExceptionRepository';
import models from '../Model';
import UncaughtException from '@domain/Core/UncaughtException/UncaughtException';
import PaginationData from '@domain/Utils/PaginationData';
import BaseRepository from './BaseRepository';
import { injectable } from 'inversify';
const { UncaughtExceptionModel, Sequelize } = models;
const { Op } = Sequelize;

@injectable()
class UncaughtExceptionRepository extends BaseRepository
  implements IUncaughtExceptionRepository {
  constructor() {
    super(UncaughtExceptionModel, 'uncaughtExceptionId', UncaughtException);
  }

  /**
   * Fetch all uncaughtExceptions from database with pagination
   * @returns UncaughtException[]
   * @param paginationOptions
   * @param options
   */
  async fetchAll(options): Promise<any> {
    const { showTrashed = false, query, paginationOptions } = options;
    const whereConditions = !!query
      ? {
          [Op.or]: [
            { message: { [Op.like]: `%${query}%` } },
            { uncaughtExceptionId: { [Op.like]: `%${query}%` } },
            { type: { [Op.like]: `%${query}%` } },
          ],
        }
      : {};

    return super.fetchAll({
      paginationOptions,
      showTrashed,
      whereConditions,
    });
  }

  async fetchAllExceptions(options): Promise<PaginationData<UncaughtException>> {
    const { showTrashed = false, query, paginationOptions } = options;
    const whereConditions = query;

    return super.fetchAll({
      paginationOptions,
      showTrashed,
      whereConditions,
    });
  }
}

export default UncaughtExceptionRepository;
