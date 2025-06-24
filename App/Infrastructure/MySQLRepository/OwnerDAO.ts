import { injectable } from 'inversify';

import models from '../Model';
import Owner from '../../Domain/Core/Owner/Owner';
import BaseRepository from './BaseRepository';
import { IOwnerDao } from '../../Domain/Core/Owner/IOwnerDao';
import DatabaseError from '../../Infrastructure/Errors/DatabaseError';

const { OwnerModel } = models;

@injectable()
class OwnerDAO extends BaseRepository implements IOwnerDao {
  constructor() {
    super(OwnerModel, 'ownerId', Owner);
  }

  /**
   * Fetch Owner BY userId
   * @param {string} userId
   * @returns Owner
   */
  async fetchByUserId(userId, showTrashed = false) {
    return super.fetchOneByCustomCritera({
      whereConditions: {
        userId,
      },
      showTrashed,
    });
  }

  /**
   * Override update method specifically for Owner model to prevent automatic timestamp updates
   * @param {Owner} owner
   * @returns {Promise<boolean>}
   */
  async update(owner, whereConditions: {} | null = null) {
    try {
      if (!whereConditions) {
        whereConditions = { ownerId: owner.ownerId };
      }

      await OwnerModel.update(owner, {
        where: whereConditions,
        silent: true, // This prevents automatic timestamp updates
        individualHooks: true,
      });

      return true;
    } catch (error) {
      throw new DatabaseError(error.message);
    }
  }

  /**
   *
   * @param {Owner} owner
   */
  async upsert(owner) {
    try {
      const ownerObj = await super.fetchById(owner.ownerId);

      if (ownerObj) {
        
        return this.update(owner);
      }

      return super.add(owner);
    } catch (error) {
      throw Error(error);
    }
  }
}

export default OwnerDAO;
