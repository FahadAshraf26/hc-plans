import Release from '@domain/Core/Release/Release';

class CreateNewUpdateDTO {
  private readonly Release: any;
  constructor(version, action, description) {
    this.Release = Release.createFromDetail(version, action, description);
  }

  /**
   * It will return release
   */
  getRelease() {
    return this.Release;
  }
}

export default CreateNewUpdateDTO;
