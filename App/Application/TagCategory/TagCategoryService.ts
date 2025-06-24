import {
  ICampaignTagRepositoryId,
  ICampaignTagRepository,
} from '@domain/Core/CampaignTag/ICampaignTagRepository';
import CreateTagCategoryDTO from './CreateTagCategoryDTO';
import GetAllTagCategoryDTO from './GetAllTagCategoryDTO';
import FindTagCategoryDTO from './FindTagCategoryDTO';
import UpdateTagCategoryDTO from './UpdateTagCategoryDTO';
import RemoveTagCategoryDTO from './RemoveTagCategoryDTO';
import { inject, injectable } from 'inversify';
import {
  ITagCategoryRepository,
  ITagCategoryRepositoryId,
} from '@domain/Core/TagCategory/ITagCategoryRepository';

import httpException from '@infrastructure/Errors/HttpException';

@injectable()
class TagCategoryService {
  constructor(
    @inject(ITagCategoryRepositoryId)
    private tagCategoryRepository: ITagCategoryRepository,
    @inject(ICampaignTagRepositoryId)
    private campaignTagRepository: ICampaignTagRepository,
  ) {}
  /**\
   *
   * @param {CreateTagCategoryDTO} createTagCategoryDTO
   * @return {Promise<void>}
   */
  async createTagCategory(createTagCategoryDTO: CreateTagCategoryDTO) {
    try {
      console.log(
        'createTagCategoryDTO.getTagCategory()',
        createTagCategoryDTO.getTagCategory(),
      );

      const tag = await this.tagCategoryRepository.add(
        createTagCategoryDTO.getTagCategory(),
      );

      if (!tag) {
        throw new httpException(400, 'Unable to create tag category');
      }

      return tag;
    } catch (e) {
      throw new Error(e);
    }
  }

  /**
   *
   * @param {GetAllTagCategoryDTO} getAllTagCategoryDTO
   * @return {Promise<void>}
   */
  async getAllTagCategories(getAllTagCategoryDTO: GetAllTagCategoryDTO) {
    try {
      const result = await this.tagCategoryRepository.fetchAll({
        paginationOptions: getAllTagCategoryDTO.getPaginationOptions(),
        showTrashed: getAllTagCategoryDTO.isShowTrashed(),
        query: getAllTagCategoryDTO.getQuery(),
      });

      return result.getPaginatedData();
    } catch (e) {
      throw new Error(e);
    }
  }

  async getAllPublicTagCategories() {
    try {
      return this.tagCategoryRepository.fetchAllPublicTagCategories();
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   *
   * @param {FindTagCategoryDTO} findTagCategoryDTO
   * @return {Promise<void>}
   */
  async findTagCategory(findTagCategoryDTO: FindTagCategoryDTO) {
    try {
      const tag = await this.tagCategoryRepository.fetchById(
        findTagCategoryDTO.getTagCategoryId(),
      );

      if (!tag) {
        throw new httpException(404, 'Tag not Found');
      }

      return tag;
    } catch (e) {
      throw new Error(e);
    }
  }

  /**
   *
   * @param {UpdateTagCategoryDTO} updateTagCategoryDTO
   * @return {Promise<boolean>}
   */
  async updateTagCategory(updateTagCategoryDTO: UpdateTagCategoryDTO) {
    try {
      const tag = await this.tagCategoryRepository.update(
        updateTagCategoryDTO.getTagCategory(),
      );

      if (!tag) {
        throw new httpException(400, 'Tag update failed');
      }

      return true;
    } catch (e) {
      throw new Error(e);
    }
  }

  /**
   *
   * @param {RemoveTagCategoryDTO} removeTagCategoryDTO
   * @return {Promise<{message: string}>}
   */
  async removeTagCategory(removeTagCategoryDTO: RemoveTagCategoryDTO) {
    try {
      const tag = await this.tagCategoryRepository.fetchById(
        removeTagCategoryDTO.getTagCategoryId(),
      );
      if (!tag) {
        throw new httpException(404, 'Tag not found');
      }

      const campaignTag = await this.campaignTagRepository.fetchByTagId(
        removeTagCategoryDTO.getTagCategoryId(),
      );

      const result = await this.tagCategoryRepository.remove(
        tag,
        removeTagCategoryDTO.shouldHardDelete(),
      );

      if (!result) {
        throw new httpException(400, 'Tag delete failed');
      }

      if (campaignTag !== undefined) {
        await this.campaignTagRepository.removeByTagId(campaignTag.tagId, false);
      }

      return { status: 'success', message: 'Deleted Successfully' };
    } catch (e) {
      throw new Error(e);
    }
  }
}

export default TagCategoryService;
