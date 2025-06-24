class FindTagDTO {
  private readonly tagId: string;
  constructor(tagId: string) {
    this.tagId = tagId;
  }

  getTagId() {
    return this.tagId;
  }
}

export default FindTagDTO;
