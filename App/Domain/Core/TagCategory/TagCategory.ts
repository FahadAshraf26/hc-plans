import uuid from 'uuid/v4';
import Tag from '../Tag/Tag';

class TagCategory {
  tagCategoryId: string;
  category: string;
  tags: Tag[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;

  constructor(tagCategoryId: string, category: string) {
    this.tagCategoryId = tagCategoryId;
    this.category = category;
    this.tags = [];
  }

  /**
   * Set Created Date
   * @param {Date} createdAt
   */
  setCreatedAt(createdAt: Date) {
    this.createdAt = createdAt;
  }

  /**
   * Set Updated Date
   * @param {Date} updatedAt
   */
  setUpdatedAt(updatedAt: Date) {
    this.updatedAt = updatedAt;
  }

  /**
   * Set Deleted Date
   * @param {Date} deletedAt
   */
  setDeletedAt(deletedAt: Date) {
    this.deletedAt = deletedAt;
  }

  /**
   * Add Tag to this category
   * @param {Tag} tag
   */
  addTag(tag: Tag) {
    this.tags.push(tag);
  }

  /**
   * Get all tags in this category
   * @returns {Tag[]}
   */
  getTags(): Tag[] {
    return this.tags;
  }

  /**
   * Create TagCategory Object
   * @param {object} tagCategoryObj
   * @returns TagCategory
   */
  static createFromObject(tagCategoryObj): TagCategory {
    const tagCategory = new TagCategory(
      tagCategoryObj.tagCategoryId,
      tagCategoryObj.category,
    );

    if (tagCategoryObj.createdAt) {
      tagCategory.setCreatedAt(tagCategoryObj.createdAt);
    }

    if (tagCategoryObj.updatedAt) {
      tagCategory.setUpdatedAt(tagCategoryObj.updatedAt);
    }

    if (tagCategoryObj.deletedAt) {
      tagCategory.setDeletedAt(tagCategoryObj.deletedAt);
    }

    // Add tags if they exist
    if (tagCategoryObj.tags && Array.isArray(tagCategoryObj.tags)) {
      tagCategoryObj.tags.forEach((tagObj) => {
        const tag = Tag.createFromObject(tagObj);
        tagCategory.addTag(tag);
      });
    }

    return tagCategory;
  }

  /**
   * Create TagCategory Object with Id
   * @param {string} category
   * @returns TagCategory
   */
  static createFromDetail(category: string) {
    return new TagCategory(uuid(), category);
  }
}

export default TagCategory;
