import Tag from '../../Domain/Core/Tag/Tag';

class CreateTagDTO {
  private readonly tag: Tag;

  constructor(tag: string) {
    this.tag = Tag.createFromDetail(tag);
  }

  getTag() {
    return this.tag;
  }
}

export default CreateTagDTO;
