import UserMedia from '@domain/Core/UserMedia/UserMedia';

class CreateUserMediaDTO {
  private userMedia: any;

  constructor(userId, name, type, path, mimeType, tinyPath) {
    this.userMedia = UserMedia.createFromDetail(
      userId,
      name,
      type,
      path,
      mimeType,
      tinyPath,
    );
  }

  getUserMedia() {
    return this.userMedia;
  }
}

export default CreateUserMediaDTO;
