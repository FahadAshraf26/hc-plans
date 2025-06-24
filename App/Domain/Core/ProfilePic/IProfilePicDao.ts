import ProfilePic from '@domain/Core/ProfilePic/ProfilePic';
import { IBaseRepository } from '@domain/Core/BaseEntity/IBaseRepository';

export const IProfilePicDaoId = Symbol.for('IProfilePicDao');

export interface IProfilePicDao extends IBaseRepository {
  fetchByUserId(userId: string, showTrashed?: string | boolean): Promise<ProfilePic>;
  updateProfilePic(profilePic: ProfilePic): Promise<boolean>;
}
