import { injectable } from 'inversify';

import models from '../Model';
import ProfilePic from '@domain/Core/ProfilePic/ProfilePic';
import BaseRepository from './BaseRepository';
import { IProfilePicDao } from '@domain/Core/ProfilePic/IProfilePicDao';

const { ProfilePicModel } = models;

@injectable()
class ProfilePicDAO extends BaseRepository implements IProfilePicDao {
  constructor() {
    super(ProfilePicModel, 'profilePicId', ProfilePic);
  }

  /**
   * fetchById(userId) fetch profilePic By Id
   * @param {string} userId
   * @returns Object
   */
  async fetchByUserId(userId, showTrashed = false): Promise<ProfilePic> {
    return super.fetchOneByCustomCritera({
      whereConditions: { userId,deletedAt:null },
      showTrashed,
    });
  }

  /**
   * Fetch profilePic by id and then update it
   * @param {ProfilePic} profilePic
   * @returns boolean
   */
  async updateProfilePic(profilePic): Promise<boolean> {
    try {
      
      const profilePicObj = await ProfilePicModel.findOne({
        where: { userId: profilePic.userId,deletedAt: null },
      });
      
      if (profilePicObj) {
        await ProfilePicModel.update(profilePic, {
          where: { userId: profilePic.userId,deletedAt:null },
        });
      } else {
        await ProfilePicModel.create(profilePic);
      }

      return true;
    } catch (error) {
      throw Error(error);
    }
  }
}

export default ProfilePicDAO;
