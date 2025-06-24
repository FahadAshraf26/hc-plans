import models from '../Model';
import IdologyTimestamp from '../../Domain/Core/IdologyTimestamp/IdologyTimestamp';
import { KycStatus } from '../../Domain/Core/ValueObjects/KycStatus';
import BaseRepository from './BaseRepository';
import { IIdologyTimestampDAO } from '@domain/Core/IdologyTimestamp/IIdologyTimestampDAO';
import { injectable } from 'inversify';

const { IdologyTimestampModel, Sequelize } = models;
const { Op } = Sequelize;

@injectable()
class IdologyTimestampDAO extends BaseRepository implements IIdologyTimestampDAO {
  constructor() {
    super(IdologyTimestampModel, 'idologyTimestampId', IdologyTimestamp);
  }

  /**
   * Fetch all idologyTimestamps from database with pagination
   * @returns IdologyTimestamp[]
   * @param paginationOptions
   * @param showTrashed
   */
  async fetchAll({ paginationOptions, options }) {
    const { showTrashed = false, query } = options;

    return await super.fetchAll({
      paginationOptions,
      showTrashed,
      whereConditions: query ? { idologyTimestampId: { [Op.like]: `%${query}%` } } : {},
    });
  }

  async fetchCountByUser(
    userId,
    { verificationStats = 'Fail', fromDate = null },
  ) {
    const whereCondition = {
      userId,
      isVerified: verificationStats,
    } as any;
    if (fromDate) {
      whereCondition.createdAt = {
        [Op.gt]: fromDate.toISOString(),
      };
    }

    const kycCount = await IdologyTimestampModel.count({
      where: whereCondition,
    });

    return kycCount || 0;
  }

  async fetchByIdologyId(idologyIdNumber) {
    return await super.fetchOneByCustomCritera({
      whereConditions: { idologyIdNumber },
    });
  }

  async fetchLatestByUser(userId) {
    return await super.fetchOneByCustomCritera({
      whereConditions: { userId },
      order: [['createdAt', 'desc']],
    });
  }
}

export default IdologyTimestampDAO;
