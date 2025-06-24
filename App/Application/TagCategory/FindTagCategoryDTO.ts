class FindTagCategoryDTO {
  private readonly tagCategoryId: string;
  constructor(tagCategoryId: string) {
    this.tagCategoryId = tagCategoryId;
  }

  getTagCategoryId() {
    return this.tagCategoryId;
  }
}

export default FindTagCategoryDTO;
