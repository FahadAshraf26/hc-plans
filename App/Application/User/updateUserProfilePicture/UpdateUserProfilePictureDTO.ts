import ProfilePic from '@domain/Core/ProfilePic/ProfilePic';

class UpdateUserProfilePictureDTO {
  private readonly userId: string;
  private readonly imageName: string;
  private profilePic: ProfilePic;

  constructor(userId: string, imageName: string) {
    this.userId = userId;
    this.imageName = imageName;
  }

  getUserId() {
    return this.userId;
  }

  getImageName() {
    return this.imageName;
  }

  getProfilePic() {
    return this.profilePic;
  }
  /**
   * Set ProfilePic
   * @param profilePicObj
   */
  setProfilePic(profilePicObj) {
    const { name = 'Test', path, mimeType, userId, originalPath } = profilePicObj;
    this.profilePic = ProfilePic.createFromDetail(
      name,
      path,
      mimeType,
      userId,
      originalPath,
    );
  }
}

export default UpdateUserProfilePictureDTO;
