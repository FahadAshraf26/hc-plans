import { inject, injectable } from 'inversify';
import { IUserRepository, IUserRepositoryId } from '@domain/Core/User/IUserRepository';
import HttpException from '@infrastructure/Errors/HttpException';
import ProfilePicEntity from '@domain/Core/ProfilePic/ProfilePic';
import profilePictureConfig from '../../../Infrastructure/Config/profilePictureConfig';
import { IUpdateUserProfilePicture } from '@application/User/updateUserProfilePicture/IUpdateUserProfilePicture';

@injectable()
class UpdateUserProfilePicture implements IUpdateUserProfilePicture {
  constructor(@inject(IUserRepositoryId) private userRepository: IUserRepository) {}

  async execute(updateUserProfilePictureDTO) {
    const user = await this.userRepository.fetchById(
      updateUserProfilePictureDTO.getUserId(),
    );

    if (!user) {
      throw new HttpException(404, 'No User record exists against provided input');
    }

    if (updateUserProfilePictureDTO.getProfilePic()) {
      user.setProfilePic(updateUserProfilePictureDTO.getProfilePic());
    } else {
      user.setProfilePic(
        ProfilePicEntity.createFromDetail(
          'profilePic',
          profilePictureConfig.returnRandomImageUrl(
            updateUserProfilePictureDTO.getImageName(),
          ),
          'image/jpeg',
          user.userId,
        ),
      );
    }

    return this.userRepository.update(user);
  }
}

export default UpdateUserProfilePicture;
