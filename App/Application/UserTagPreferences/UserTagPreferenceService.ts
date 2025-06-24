// Application/UserTagPreference/UserTagPreferenceService.ts
import { inject, injectable } from 'inversify';
import {
  IUserTagPreferenceRepository,
  IUserTagPreferenceRepositoryId,
} from '@domain/Core/UserPreferences/IUserTagPreferenceRepository';
import { ITagRepository, ITagRepositoryId } from '../../Domain/Core/Tag/ITagRepository';
import CreateUserTagPreferenceDTO from './CreateUserTagPreferenceDTO';
import UpdateUserTagPreferenceDTO from './UpdateUserTagPreferenceDTO';
import GetUserTagPreferenceDTO from './GetUserTagPreferenceDTO';
import AddRemoveTagPreferenceDTO from './AddRemoveTagPreferenceDTO';
import httpException from '../../Infrastructure/Errors/HttpException';
import GetUsersWithPreferencesDTO from './GetUsersWithPreferencesDTO';

@injectable()
class UserTagPreferenceService {
  constructor(
    @inject(IUserTagPreferenceRepositoryId)
    private userTagPreferenceRepository: IUserTagPreferenceRepository,
    @inject(ITagRepositoryId)
    private tagRepository: ITagRepository,
  ) {}

  /**
   * Save user tag preferences (replace all existing with new ones)
   * @param {CreateUserTagPreferenceDTO} createUserTagPreferenceDTO
   * @return {Promise<boolean>}
   */
  async saveUserTagPreferences(createUserTagPreferenceDTO: CreateUserTagPreferenceDTO) {
    try {
      const userId = createUserTagPreferenceDTO.getUserId();
      const tagIds = createUserTagPreferenceDTO.getTagIds();

      // Validate that all tagIds exist if any provided
      if (tagIds.length > 0) {
        for (const tagId of tagIds) {
          const tag = await this.tagRepository.fetchById(tagId);
          if (!tag) {
            throw new httpException(400, `Tag with ID ${tagId} not found`);
          }
        }
      }

      // Replace all preferences for this user
      const result = await this.userTagPreferenceRepository.bulkReplaceUserTagPreferencesWithUpsert(
        userId,
        tagIds,
      );

      if (!result) {
        throw new httpException(400, 'Unable to save user tag preferences');
      }

      return true;
    } catch (e) {
      console.log('Error: ', e);
      throw new Error(e);
    }
  }

  /**
   * Get user tag preferences with tag details
   * @param {GetUserTagPreferenceDTO} getUserTagPreferenceDTO
   * @return {Promise<any>}
   */
  async getUserTagPreferences(getUserTagPreferenceDTO: GetUserTagPreferenceDTO) {
    try {
      const userId = getUserTagPreferenceDTO.getUserId();
      const userTagPreferences = await this.userTagPreferenceRepository.fetchByUserId(
        userId,
      );

      // Get tag details for each preference
      const tagDetails = [];
      for (const preference of userTagPreferences) {
        const tag = await this.tagRepository.fetchById(preference.tagId);
        if (tag) {
          tagDetails.push({
            userTagPreferenceId: preference.userTagPreferenceId,
            tagId: tag.tagId,
            tag: tag.tag,
            tagCategoryId: tag.tagCategoryId,
            createdAt: preference.createdAt,
            updatedAt: preference.updatedAt,
          });
        }
      }

      return {
        userId,
        preferences: tagDetails,
        totalCount: tagDetails.length,
      };
    } catch (e) {
      throw new Error(e);
    }
  }

  /**
   * Update user tag preferences (replace all)
   * @param {UpdateUserTagPreferenceDTO} updateUserTagPreferenceDTO
   * @return {Promise<boolean>}
   */
  async updateUserTagPreferences(updateUserTagPreferenceDTO: UpdateUserTagPreferenceDTO) {
    try {
      const userId = updateUserTagPreferenceDTO.getUserId();
      const tagIds = updateUserTagPreferenceDTO.getTagIds();

      // Validate that all tagIds exist if any provided
      if (tagIds.length > 0) {
        for (const tagId of tagIds) {
          const tag = await this.tagRepository.fetchById(tagId);
          if (!tag) {
            throw new httpException(400, `Tag with ID ${tagId} not found`);
          }
        }
      }

      const result = await this.userTagPreferenceRepository.bulkReplaceUserTagPreferencesWithUpsert(
        userId,
        tagIds,
      );

      if (!result) {
        throw new httpException(400, 'Unable to update user tag preferences');
      }

      return true;
    } catch (e) {
      throw new Error(e);
    }
  }

  /**
   * Add a single tag preference for user
   * @param {AddRemoveTagPreferenceDTO} addRemoveTagPreferenceDTO
   * @return {Promise<boolean>}
   */
  async addUserTagPreference(addRemoveTagPreferenceDTO: AddRemoveTagPreferenceDTO) {
    try {
      const userId = addRemoveTagPreferenceDTO.getUserId();
      const tagId = addRemoveTagPreferenceDTO.getTagId();

      // Validate tag exists
      const tag = await this.tagRepository.fetchById(tagId);
      if (!tag) {
        throw new httpException(400, `Tag with ID ${tagId} not found`);
      }

      // Check if preference already exists
      const existingPreference = await this.userTagPreferenceRepository.fetchByUserIdAndTagId(
        userId,
        tagId,
      );

      if (existingPreference) {
        throw new httpException(400, 'User already has this tag preference');
      }

      const result = await this.userTagPreferenceRepository.addUserTagPreference(
        userId,
        tagId,
      );

      if (!result) {
        throw new httpException(400, 'Unable to add user tag preference');
      }

      return true;
    } catch (e) {
      throw new Error(e);
    }
  }

  /**
   * Remove a single tag preference for user
   * @param {AddRemoveTagPreferenceDTO} addRemoveTagPreferenceDTO
   * @return {Promise<{message: string}>}
   */
  async removeUserTagPreference(addRemoveTagPreferenceDTO: AddRemoveTagPreferenceDTO) {
    try {
      const userId = addRemoveTagPreferenceDTO.getUserId();
      const tagId = addRemoveTagPreferenceDTO.getTagId();

      // Check if preference exists
      const existingPreference = await this.userTagPreferenceRepository.fetchByUserIdAndTagId(
        userId,
        tagId,
      );

      if (!existingPreference) {
        throw new httpException(404, 'User tag preference not found');
      }

      const result = await this.userTagPreferenceRepository.removeUserTagPreference(
        userId,
        tagId,
      );

      if (!result) {
        throw new httpException(400, 'Unable to remove user tag preference');
      }

      return { status: 'success', message: 'Tag preference removed successfully' };
    } catch (e) {
      throw new Error(e);
    }
  }

  /**
   * Remove all tag preferences for a user
   * @param {GetUserTagPreferenceDTO} getUserTagPreferenceDTO
   * @return {Promise<{message: string}>}
   */
  async removeAllUserTagPreferences(getUserTagPreferenceDTO: GetUserTagPreferenceDTO) {
    try {
      const userId = getUserTagPreferenceDTO.getUserId();

      const result = await this.userTagPreferenceRepository.removeAllUserTagPreferences(
        userId,
      );

      if (!result) {
        throw new httpException(400, 'Unable to remove user tag preferences');
      }

      return { status: 'success', message: 'All tag preferences removed successfully' };
    } catch (e) {
      throw new Error(e);
    }
  }

  /**
   * Get users who have saved tag preferences (admin endpoint)
   * @param {GetUsersWithPreferencesDTO} getUsersWithPreferencesDTO
   * @return {Promise<any>}
   */
  async getUsersWithPreferences(getUsersWithPreferencesDTO: GetUsersWithPreferencesDTO) {
    try {
      const result = await this.userTagPreferenceRepository.fetchUsersWithPreferences({
        paginationOptions: getUsersWithPreferencesDTO.getPaginationOptions(),
        searchQuery: getUsersWithPreferencesDTO.getSearchQuery(),
      });

      return result.getPaginatedData();
    } catch (e) {
      throw new Error(e);
    }
  }
}

export default UserTagPreferenceService;
