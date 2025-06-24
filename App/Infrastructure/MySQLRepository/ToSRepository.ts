import models from '../Model';
import { IToSRepository } from '@domain/Core/ToS/IToSRepository';
import { injectable } from 'inversify';
import ToS from '../../Domain/Core/ToS/ToS';
import BaseRepository from './BaseRepository';

const { TosModel } = models;

@injectable()
class ToSRepository extends BaseRepository implements IToSRepository {
  constructor() {
    super(TosModel, 'tosId', ToS);
  }

  /**
   * Fetch all toss from database with pagination
   * @returns ToS[]
   * @param paginationOptions
   * @param showTrashed
   */
  async fetchAll({ paginationOptions, showTrashed = false }) {
    return await super.fetchAll({
      paginationOptions,
      showTrashed,
    });
  }

  async fetchTos() {
    return await super.fetchOneByCustomCritera({
      order: [['createdAt', 'desc']],
    });
  }

  /**
   * fetchById(tosId) fetch tos By Id
   * @param {string} tosId
   * @returns ToS
   */
  async fetchById(tosId) {
    return await super.fetchById(tosId);
  }
}

export default ToSRepository;
