class RemoveTagDTO {
  private readonly tagId: string;
  private readonly hardDelete: string;
  constructor(tagId: string, hardDelete: string) {
    this.tagId = tagId;
    this.hardDelete = hardDelete;
  }

  getTagId() {
    return this.tagId;
  }

  shouldHardDelete() {
    return this.hardDelete === 'true';
  }
}

export default RemoveTagDTO;
