// Infrastructure/Controllers/UserTagPreferenceController.ts
import { injectable } from 'inversify';
import UserTagPreferenceService from '@application/UserTagPreferences/UserTagPreferenceService';
import CreateUserTagPreferenceDTO from '@application/UserTagPreferences/CreateUserTagPreferenceDTO';
import UpdateUserTagPreferenceDTO from '@application/UserTagPreferences/UpdateUserTagPreferenceDTO';
import GetUserTagPreferenceDTO from '@application/UserTagPreferences/GetUserTagPreferenceDTO';
import AddRemoveTagPreferenceDTO from '@application/UserTagPreferences/AddRemoveTagPreferenceDTO';
import GetUsersWithPreferencesDTO from '@application/UserTagPreferences/GetUsersWithPreferencesDTO';

/**
 * @typedef {import('../Utils/makeExpressCallback').HttpRequest} HttpRequest
 * @typedef {import('../Utils/makeExpressCallback').HttpResponse} HttpResponse
 */

@injectable()
class UserTagPreferenceController {
  constructor(private userTagPreferenceService: UserTagPreferenceService) {}

  /**
   * Save user tag preferences (replace all existing)
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  saveUserTagPreferences = async (httpRequest) => {
    const { userId } = httpRequest.params;
    const { tagIds } = httpRequest.body;

    const createUserTagPreferenceDTO = new CreateUserTagPreferenceDTO(userId, tagIds);
    await this.userTagPreferenceService.saveUserTagPreferences(
      createUserTagPreferenceDTO,
    );

    return {
      body: {
        status: 'success',
        message: 'User tag preferences saved successfully',
      },
    };
  };

  /**
   * Get user tag preferences
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  getUserTagPreferences = async (httpRequest) => {
    const { userId } = httpRequest.params;

    const getUserTagPreferenceDTO = new GetUserTagPreferenceDTO(userId);
    const userTagPreferences = await this.userTagPreferenceService.getUserTagPreferences(
      getUserTagPreferenceDTO,
    );

    return {
      body: {
        status: 'success',
        data: userTagPreferences,
      },
    };
  };

  /**
   * Update user tag preferences (replace all existing)
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  updateUserTagPreferences = async (httpRequest) => {
    const { userId } = httpRequest.params;
    const { tagIds } = httpRequest.body;

    const updateUserTagPreferenceDTO = new UpdateUserTagPreferenceDTO(userId, tagIds);
    await this.userTagPreferenceService.updateUserTagPreferences(
      updateUserTagPreferenceDTO,
    );

    return {
      body: {
        status: 'success',
        message: 'User tag preferences updated successfully',
      },
    };
  };

  /**
   * Add a single tag preference for user
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  addUserTagPreference = async (httpRequest) => {
    const { userId, tagId } = httpRequest.params;

    const addRemoveTagPreferenceDTO = new AddRemoveTagPreferenceDTO(userId, tagId);
    await this.userTagPreferenceService.addUserTagPreference(addRemoveTagPreferenceDTO);

    return {
      body: {
        status: 'success',
        message: 'Tag preference added successfully',
      },
    };
  };

  /**
   * Remove a single tag preference for user
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  removeUserTagPreference = async (httpRequest) => {
    const { userId, tagId } = httpRequest.params;

    const addRemoveTagPreferenceDTO = new AddRemoveTagPreferenceDTO(userId, tagId);
    const result = await this.userTagPreferenceService.removeUserTagPreference(
      addRemoveTagPreferenceDTO,
    );

    return { body: result };
  };

  /**
   * Remove all tag preferences for user
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  removeAllUserTagPreferences = async (httpRequest) => {
    const { userId } = httpRequest.params;

    const getUserTagPreferenceDTO = new GetUserTagPreferenceDTO(userId);
    const result = await this.userTagPreferenceService.removeAllUserTagPreferences(
      getUserTagPreferenceDTO,
    );

    return { body: result };
  };

  /**
   * Get users who have saved tag preferences (admin endpoint)
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  getUsersWithPreferences = async (httpRequest) => {
    const { page, perPage, search } = httpRequest.query;

    const getUsersWithPreferencesDTO = new GetUsersWithPreferencesDTO(
      page,
      perPage,
      search,
    );

    const usersWithPreferences = await this.userTagPreferenceService.getUsersWithPreferences(
      getUsersWithPreferencesDTO,
    );

    return { body: usersWithPreferences };
  };
}

export default UserTagPreferenceController;
