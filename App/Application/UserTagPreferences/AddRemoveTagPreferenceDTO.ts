class AddRemoveTagPreferenceDTO {
  private readonly userId: string;
  private readonly tagId: string;

  constructor(userId: string, tagId: string) {
    this.userId = userId;
    this.tagId = tagId;
  }

  getUserId(): string {
    return this.userId;
  }

  getTagId(): string {
    return this.tagId;
  }
}

export default AddRemoveTagPreferenceDTO;
