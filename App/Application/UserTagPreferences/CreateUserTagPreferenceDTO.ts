class CreateUserTagPreferenceDTO {
  private readonly userId: string;
  private readonly tagIds: string[];

  constructor(userId: string, tagIds: string[]) {
    this.userId = userId;
    this.tagIds = tagIds || [];
  }

  getUserId(): string {
    return this.userId;
  }

  getTagIds(): string[] {
    return this.tagIds;
  }

  hasTagIds(): boolean {
    return this.tagIds.length > 0;
  }
}

export default CreateUserTagPreferenceDTO;
