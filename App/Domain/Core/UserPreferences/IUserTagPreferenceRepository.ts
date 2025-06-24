// Domain/Core/UserTagPreference/IUserTagPreferenceRepository.ts
import UserTagPreference from './UserTagPreference';
import { IBaseRepository } from '@domain/Core/BaseEntity/IBaseRepository';
import PaginationData from '../../Utils/PaginationData';

export const IUserTagPreferenceRepositoryId = Symbol.for('IUserTagPreferenceRepository');

export interface IUserTagPreferenceRepository extends IBaseRepository {
  fetchByUserId(userId: string): Promise<UserTagPreference[]>;
  fetchByUserIdAndTagId(
    userId: string,
    tagId: string,
  ): Promise<UserTagPreference | false>;
  addUserTagPreference(userId: string, tagId: string): Promise<boolean>;
  removeUserTagPreference(userId: string, tagId: string): Promise<boolean>;
  removeAllUserTagPreferences(userId: string): Promise<boolean>;
  bulkAddUserTagPreferences(userId: string, tagIds: string[]): Promise<boolean>;
  bulkReplaceUserTagPreferencesWithUpsert(
    userId: string,
    tagIds: string[],
  ): Promise<boolean>;
  fetchUsersWithPreferences(options: {
    paginationOptions: any;
    searchQuery?: string;
    hasPreferencesOnly?: boolean;
  }): Promise<PaginationData<any>>;
}
