import { UseCase } from '@application/BaseInterface/UseCase';
import UpdateUserProfilePictureDTO from '@application/User/updateUserProfilePicture/UpdateUserProfilePictureDTO';

export const IUpdateUserProfilePictureId = Symbol.for('IUpdateUserProfilePicture');
export interface IUpdateUserProfilePicture
  extends UseCase<UpdateUserProfilePictureDTO, boolean> {}
