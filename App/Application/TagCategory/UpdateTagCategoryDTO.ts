import TagCategory from '@domain/Core/TagCategory/TagCategory';

class UpdateTagCategoryDTO {
  private readonly tagCategory: TagCategory;

  constructor(tagObj: any) {
    this.tagCategory = TagCategory.createFromObject(tagObj);
  }

  getTagCategory() {
    return this.tagCategory;
  }

  getTagCategoryId() {
    return this.tagCategory.tagCategoryId;
  }
}

export default UpdateTagCategoryDTO;
