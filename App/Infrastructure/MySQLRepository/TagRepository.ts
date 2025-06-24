import { injectable } from 'inversify';
import Tag from '../../Domain/Core/Tag/Tag';
import BaseRepository from './BaseRepository';
import { Op } from 'sequelize';
import { ITagRepository } from '../../Domain/Core/Tag/ITagRepository';
import PaginationData from '../../Domain/Utils/PaginationData';
import models from '../Model';
const { TagModel } = models;

@injectable()
class TagRepository extends BaseRepository implements ITagRepository {
  constructor() {
    super(TagModel, 'tagId', Tag);
  }

  /**
   * Fetch all tags from database with pagination
   * @returns Tag[]
   * @param paginationOptions
   * @param showTrashed
   * @param query
   */
  async fetchAll({
    paginationOptions,
    showTrashed = false,
    query,
  }): Promise<PaginationData<Tag>> {
    return super.fetchAll({
      paginationOptions,
      showTrashed,
      whereConditions: query ? { tag: { [Op.like]: `%${query}%` } } : {},
    });
  }

  async fetchAllPublicTags(): Promise<Array<Tag>> {
    return TagModel.findAll({
      order: [['tag', 'ASC']],
    });
  }
}

export default TagRepository;
