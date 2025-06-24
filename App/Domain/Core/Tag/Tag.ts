import uuid from 'uuid/v4';

class Tag {
  tagId: string;
  tag: string;
  tagCategoryId: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;

  constructor(tagId: string, tag: string) {
    this.tagId = tagId;
    this.tag = tag;
    this.tagCategoryId = null;
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
  setDeletedAT(deletedAt: Date) {
    this.deletedAt = deletedAt;
  }

  /**
   * Set the category this tag belongs to
   * @param {string} categoryId
   */
  setCategory(categoryId: string) {
    this.tagCategoryId = categoryId;
  }

  /**
   * Create Tag Object
   * @param {object} tagObj
   * @returns Tag
   */
  static createFromObject(tagObj): Tag {
    const tag = new Tag(tagObj.tagId, tagObj.tag);

    if (tagObj.createdAt) {
      tag.setCreatedAt(tagObj.createdAt);
    }

    if (tagObj.updatedAt) {
      tag.setUpdatedAt(tagObj.updatedAt);
    }

    if (tagObj.deletedAt) {
      tag.setDeletedAT(tagObj.deletedAt);
    }

    if (tagObj.tagCategoryId) {
      tag.setCategory(tagObj.tagCategoryId);
    }

    return tag;
  }

  /**
   * Create Tag Object with Id
   * @param {string} tag
   * @param {string} categoryId - Optional category ID
   * @returns Tag
   */
  static createFromDetail(tag: string, categoryId?: string) {
    const newTag = new Tag(uuid(), tag);
    if (categoryId) {
      newTag.setCategory(categoryId);
    }
    return newTag;
  }
}

export default Tag;
