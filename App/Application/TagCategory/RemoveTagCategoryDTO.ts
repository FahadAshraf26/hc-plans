class RemoveTagCategoryDTO {
  private readonly tagCategoryId: string;
  private readonly hardDelete: string;
  constructor(tagCategoryId: string, hardDelete: string) {
    this.tagCategoryId = tagCategoryId;
    this.hardDelete = hardDelete;
  }

  getTagCategoryId() {
    return this.tagCategoryId;
  }

  shouldHardDelete() {
    return this.hardDelete === 'true';
  }
}

export default RemoveTagCategoryDTO;
