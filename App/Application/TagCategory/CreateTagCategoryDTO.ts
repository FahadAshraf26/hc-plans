import TagCategory from '@domain/Core/TagCategory/TagCategory';

class CreateTagCategoryDTO {
  private readonly tagCategory: TagCategory;

  constructor(category: string) {
    this.tagCategory = TagCategory.createFromDetail(category);
  }

  getTagCategory() {
    return this.tagCategory;
  }
}

export default CreateTagCategoryDTO;
