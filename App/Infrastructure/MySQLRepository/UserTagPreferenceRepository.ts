import { injectable } from 'inversify';
import UserTagPreference from '@domain/Core/UserPreferences/UserTagPreference';
import BaseRepository from './BaseRepository';
import { IUserTagPreferenceRepository } from '@domain/Core/UserPreferences/IUserTagPreferenceRepository';
import DatabaseError from '../Errors/DatabaseError';
import models from '../Model';
import PaginationData from '@domain/Utils/PaginationData';
const { UserTagPreferenceModel, TagModel, Op, UserModel } = models;

@injectable()
class UserTagPreferenceRepository extends BaseRepository
  implements IUserTagPreferenceRepository {
  constructor() {
    super(UserTagPreferenceModel, 'userTagPreferenceId', UserTagPreference);
  }

  /**
   * Fetch all tag preferences for a user with tag details
   * @param {string} userId
   * @returns {Promise<UserTagPreference[]>}
   */
  async fetchByUserId(userId: string): Promise<UserTagPreference[]> {
    try {
      const userTagPreferences = await UserTagPreferenceModel.findAll({
        where: { userId },
        include: [
          {
            model: TagModel,
            as: 'tag',
            required: true,
          },
        ],
        paranoid: true,
      });

      return userTagPreferences.map((preference) =>
        UserTagPreference.createFromObject(preference),
      );
    } catch (error) {
      throw new DatabaseError(error.message);
    }
  }

  /**
   * Fetch specific user-tag preference
   * @param {string} userId
   * @param {string} tagId
   * @returns {Promise<UserTagPreference | false>}
   */
  async fetchByUserIdAndTagId(
    userId: string,
    tagId: string,
  ): Promise<UserTagPreference | false> {
    try {
      const userTagPreference = await UserTagPreferenceModel.findOne({
        where: { userId, tagId },
        paranoid: true,
      });

      if (!userTagPreference) {
        return false;
      }

      return UserTagPreference.createFromObject(userTagPreference);
    } catch (error) {
      throw new DatabaseError(error.message);
    }
  }

  /**
   * Add a tag preference for a user
   * @param {string} userId
   * @param {string} tagId
   * @returns {Promise<boolean>}
   */
  async addUserTagPreference(userId: string, tagId: string): Promise<boolean> {
    try {
      const userTagPreference = UserTagPreference.createFromDetails(userId, tagId);

      await UserTagPreferenceModel.create({
        userTagPreferenceId: userTagPreference.userTagPreferenceId,
        userId: userTagPreference.userId,
        tagId: userTagPreference.tagId,
      });

      return true;
    } catch (error) {
      throw new DatabaseError(error.message);
    }
  }

  /**
   * Remove a tag preference for a user
   * @param {string} userId
   * @param {string} tagId
   * @returns {Promise<boolean>}
   */
  async removeUserTagPreference(userId: string, tagId: string): Promise<boolean> {
    try {
      const result = await UserTagPreferenceModel.destroy({
        where: { userId, tagId },
        force: false, // Soft delete
      });

      return result > 0;
    } catch (error) {
      throw new DatabaseError(error.message);
    }
  }

  /**
   * Remove all tag preferences for a user
   * @param {string} userId
   * @returns {Promise<boolean>}
   */
  async removeAllUserTagPreferences(userId: string): Promise<boolean> {
    try {
      await UserTagPreferenceModel.destroy({
        where: { userId },
        force: false, // Soft delete
      });

      return true;
    } catch (error) {
      throw new DatabaseError(error.message);
    }
  }

  /**
   * Bulk add tag preferences for a user
   * @param {string} userId
   * @param {string[]} tagIds
   * @returns {Promise<boolean>}
   */
  async bulkAddUserTagPreferences(userId: string, tagIds: string[]): Promise<boolean> {
    try {
      const userTagPreferences = tagIds.map((tagId) => {
        const preference = UserTagPreference.createFromDetails(userId, tagId);
        return {
          userTagPreferenceId: preference.userTagPreferenceId,
          userId: preference.userId,
          tagId: preference.tagId,
        };
      });

      await UserTagPreferenceModel.bulkCreate(userTagPreferences, {
        ignoreDuplicates: true, // Ignore if combination already exists
      });

      return true;
    } catch (error) {
      throw new DatabaseError(error.message);
    }
  }

  /**
   * Alternative implementation using UPSERT approach (if you prefer soft deletes)
   * @param {string} userId
   * @param {string[]} tagIds
   * @returns {Promise<boolean>}
   */
  async bulkReplaceUserTagPreferencesWithUpsert(
    userId: string,
    tagIds: string[],
  ): Promise<boolean> {
    try {
      const transaction = await UserTagPreferenceModel.sequelize.transaction();

      try {
        // Get all existing preferences for this user (including soft-deleted ones)
        const existingPreferences = await UserTagPreferenceModel.findAll({
          where: { userId },
          paranoid: false, // Include soft-deleted records
          transaction,
        });

        // Soft delete all existing preferences first
        await UserTagPreferenceModel.destroy({
          where: { userId },
          force: false, // Soft delete
          transaction,
        });

        // Process new tag preferences
        if (tagIds.length > 0) {
          const uniqueTagIds = [...new Set(tagIds)];

          for (const tagId of uniqueTagIds) {
            // Check if this combination existed before (even if soft-deleted)
            const existingPreference = existingPreferences.find(
              (pref) => pref.tagId === tagId,
            );

            if (existingPreference) {
              // Restore the existing record by setting deletedAt to null
              await UserTagPreferenceModel.update(
                { deletedAt: null },
                {
                  where: {
                    userTagPreferenceId: existingPreference.userTagPreferenceId,
                  },
                  paranoid: false, // Update even soft-deleted records
                  transaction,
                },
              );
            } else {
              // Create new preference record
              const preference = UserTagPreference.createFromDetails(userId, tagId);
              await UserTagPreferenceModel.create(
                {
                  userTagPreferenceId: preference.userTagPreferenceId,
                  userId: preference.userId,
                  tagId: preference.tagId,
                },
                { transaction },
              );
            }
          }
        }

        await transaction.commit();
        return true;
      } catch (error) {
        await transaction.rollback();
        throw error;
      }
    } catch (error) {
      throw new DatabaseError(error.message);
    }
  }

  /**
   * Fetch only users who have saved tag preferences
   * @param {object} options
   * @returns {Promise<PaginationData<any>>}
   */
  async fetchUsersWithPreferences(options: {
    paginationOptions: any;
    searchQuery?: string;
  }): Promise<PaginationData<any>> {
    try {
      const { paginationOptions, searchQuery = '' } = options;

      // Start with UserTagPreference table and join to get user details
      let whereConditions: any = {};

      // Build search conditions if provided
      if (searchQuery) {
        // We'll need to join with User table for search, so we'll use a different approach
        const { UserModel } = models;

        // First, get user IDs that match the search criteria
        const matchingUsers = await UserModel.findAll({
          where: {
            [Op.or]: [
              { email: { [Op.like]: `%${searchQuery}%` } },
              { firstName: { [Op.like]: `%${searchQuery}%` } },
              { lastName: { [Op.like]: `%${searchQuery}%` } },
            ],
          },
          attributes: ['userId'],
          paranoid: true,
        });

        const matchingUserIds = matchingUsers.map((user) => user.userId);

        if (matchingUserIds.length === 0) {
          // No users match search criteria, return empty result
          return new PaginationData(paginationOptions, 0);
        }

        whereConditions.userId = { [Op.in]: matchingUserIds };
      }

      // Query UserTagPreferences with User and Tag details
      const response = await UserTagPreferenceModel.findAndCountAll({
        where: whereConditions,
        include: [
          {
            model: UserModel,
            as: 'user',
            attributes: [
              'userId',
              'email',
              'firstName',
              'lastName',
              'createdAt',
              'updatedAt',
            ],
            required: true, // INNER JOIN - only get preferences with valid users
          },
          {
            model: TagModel,
            as: 'tag',
            attributes: ['tagId', 'tag', 'tagCategoryId'],
            required: true, // INNER JOIN - only get preferences with valid tags
          },
        ],
        attributes: ['userTagPreferenceId', 'userId', 'tagId', 'createdAt', 'updatedAt'],
        limit: paginationOptions.limit(),
        offset: paginationOptions.offset(),
        paranoid: true,
        order: [['createdAt', 'DESC']],
      });

      // Group preferences by user
      const userPreferencesMap = new Map();

      response.rows.forEach((preference) => {
        const userId = preference.userId;

        if (!userPreferencesMap.has(userId)) {
          userPreferencesMap.set(userId, {
            userId: preference.user.userId,
            email: preference.user.email,
            firstName: preference.user.firstName,
            lastName: preference.user.lastName,
            fullName: `${preference.user.firstName} ${preference.user.lastName}`.trim(),
            userCreatedAt: preference.user.createdAt,
            userUpdatedAt: preference.user.updatedAt,
            tags: [],
            totalPreferences: 0,
          });
        }

        const userData = userPreferencesMap.get(userId);
        userData.tags.push({
          tagId: preference.tag.tagId,
          tag: preference.tag.tag,
          tagCategoryId: preference.tag.tagCategoryId,
          preferenceCreatedAt: preference.createdAt,
          preferenceUpdatedAt: preference.updatedAt,
        });
        userData.totalPreferences = userData.tags.length;
      });

      // Get unique users count for pagination
      const uniqueUserIds = new Set(response.rows.map((pref) => pref.userId));
      const totalUniqueUsers = uniqueUserIds.size;

      // Create pagination data
      const paginationData = new PaginationData(paginationOptions, totalUniqueUsers);

      // Add users to pagination data
      Array.from(userPreferencesMap.values()).forEach((userData) => {
        paginationData.addItem(userData);
      });

      return paginationData;
    } catch (error) {
      throw new DatabaseError(error.message);
    }
  }
}

export default UserTagPreferenceRepository;
