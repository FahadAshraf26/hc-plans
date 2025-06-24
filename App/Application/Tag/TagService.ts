import {
  ICampaignTagRepositoryId,
  ICampaignTagRepository,
} from './../../Domain/Core/CampaignTag/ICampaignTagRepository';
import CreateTagDTO from './CreateTagDTO';
import GetAllTagDTO from './GetAllTagDTO';
import FindTagDTO from './FindTagDTO';
import UpdateTagDTO from './UpdateTagDTO';
import RemoveTagDTO from './RemoveTagDTO';
import { inject, injectable } from 'inversify';
import { ITagRepository, ITagRepositoryId } from '../../Domain/Core/Tag/ITagRepository';

import httpException from '../../Infrastructure/Errors/HttpException';

@injectable()
class TagService {
  constructor(
    @inject(ITagRepositoryId) private tagRepository: ITagRepository,
    @inject(ICampaignTagRepositoryId)
    private campaignTagRepository: ICampaignTagRepository,
  ) {}
  /**\
   *
   * @param {CreateTagDTO} createTagDTO
   * @return {Promise<void>}
   */
  async createTag(createTagDTO: CreateTagDTO) {
    try {
      const tag = await this.tagRepository.add(createTagDTO.getTag());

      if (!tag) {
        throw new httpException(400, 'Unable to create tag');
      }

      return tag;
    } catch (e) {
      throw new Error(e);
    }
  }

  /**
   *
   * @param {GetAllTagDTO} getAllTagDTO
   * @return {Promise<void>}
   */
  async getAllTag(getAllTagDTO: GetAllTagDTO) {
    try {
      const result = await this.tagRepository.fetchAll({
        paginationOptions: getAllTagDTO.getPaginationOptions(),
        showTrashed: getAllTagDTO.isShowTrashed(),
        query: getAllTagDTO.getQuery(),
      });

      return result.getPaginatedData();
    } catch (e) {
      throw new Error(e);
    }
  }

  async getAllPublicTag() {
    try {
      return this.tagRepository.fetchAllPublicTags();
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   *
   * @param {FindTagDTO} findTagDTO
   * @return {Promise<void>}
   */
  async findTag(findTagDTO: FindTagDTO) {
    try {
      const tag = await this.tagRepository.fetchById(findTagDTO.getTagId());

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
   * @param {UpdateTagDTO} updateTagDTO
   * @return {Promise<boolean>}
   */
  async updateTag(updateTagDTO: UpdateTagDTO) {
    try {
      const tag = await this.tagRepository.update(updateTagDTO.getTag());

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
   * @param {RemoveTagDTO} removeTagDTO
   * @return {Promise<{message: string}>}
   */
  async removeTag(removeTagDTO: RemoveTagDTO) {
    try {
      const tag = await this.tagRepository.fetchById(removeTagDTO.getTagId());
      if (!tag) {
        throw new httpException(404, 'Tag not found');
      }

      const campaignTag = await this.campaignTagRepository.fetchByTagId(
        removeTagDTO.getTagId(),
      );

      const result = await this.tagRepository.remove(
        tag,
        removeTagDTO.shouldHardDelete(),
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

export default TagService;
