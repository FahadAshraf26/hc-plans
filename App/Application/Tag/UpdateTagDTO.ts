import Tag from '../../Domain/Core/Tag/Tag';

class UpdateTagDTO {
  private readonly tag: Tag;

  constructor(tagObj: any) {
    this.tag = Tag.createFromObject(tagObj);
  }

  getTag() {
    return this.tag;
  }

  getTagId() {
    return this.tag.tagId;
  }
}

export default UpdateTagDTO;
