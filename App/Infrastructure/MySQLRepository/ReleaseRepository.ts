import BaseRepository from './BaseRepository';
import Release from '@domain/Core/Release/Release';
import models from '../Model';
import PaginationData from '@domain/Utils/PaginationData';
import UserMedia from '@domain/Core/UserMedia/UserMedia';
import { IReleaseRepository } from '@domain/Core/Release/IReleaseRepository';
import { injectable } from 'inversify';
const { ReleaseModel, Sequelize } = models;
const { Op } = Sequelize;

@injectable()
class ReleaseRepository extends BaseRepository implements IReleaseRepository {
  constructor() {
    super(ReleaseModel, 'releaseId', Release);
  }
  /**
   * It will fetch all releases
   * @param {*} paginationOptions
   * @param {*} options
   * @returns {Release}
   */
  async fetchAll(options): Promise<PaginationData<Release>> {
    const { paginationOptions, showTrashed = false } = options;
    return await super.fetchAll({
      paginationOptions,
      showTrashed,
      whereConditions: {},
    });
  }
}

export default ReleaseRepository;
