import { injectable } from 'inversify';
import BaseRepository from './BaseRepository';
import { Op } from 'sequelize';
import { ITagCategoryRepository } from '@domain/Core/TagCategory/ITagCategoryRepository';
import PaginationData from '@domain/Utils/PaginationData';
import models from '../Model';
import TagCategory from '@domain/Core/TagCategory/TagCategory';
const { TagCategoryModel, TagModel } = models;

@injectable()
class TagCategoryRepository extends BaseRepository implements ITagCategoryRepository {
  constructor() {
    super(TagCategoryModel, 'tagCategoryId', TagCategory);
  }
  /**
   * Fetch all tag categories from database with pagination
   * @returns Tag[]
   * @param paginationOptions
   * @param showTrashed
   * @param query
   */
  async fetchAll({
    paginationOptions,
    showTrashed = false,
    query,
  }): Promise<PaginationData<TagCategory>> {
    return super.fetchAll({
      paginationOptions,
      showTrashed,
      whereConditions: query ? { tag: { [Op.like]: `%${query}%` } } : {},
    });
  }
  async fetchAllPublicTagCategories(): Promise<Array<TagCategory>> {
    const tagCategories = await TagCategoryModel.findAll({
      include: [
        {
          model: TagModel,
          as: 'tags',
          attributes: ['tagId', 'tag'],
        },
      ],
      order: [
        ['category', 'ASC'],
        [{ model: TagModel, as: 'tags' }, 'tag', 'ASC'],
      ],
    });

    return tagCategories;
  }
}

export default TagCategoryRepository;
