import TagService from '../../Application/Tag/TagService';
import CreateTagDTO from '../../Application/Tag/CreateTagDTO';
import GetAllTagDTO from '../../Application/Tag/GetAllTagDTO';
import FindTagDTO from '../../Application/Tag/FindTagDTO';
import UpdateTagDTO from '../../Application/Tag/UpdateTagDTO';
import RemoveTagDTO from '../../Application/Tag/RemoveTagDTO';
import { injectable } from 'inversify';

/**
 * @typedef {import('../Utils/makeExpressCallback').HttpRequest} HttpRequest
 * @typedef {import('../Utils/makeExpressCallback').HttpResponse} HttpResponse
 */

@injectable()
class TagController {
  constructor(private tagService: TagService) {}
  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  createTag = async (httpRequest) => {
    const { tag } = httpRequest.body;

    const createTagDTO = new CreateTagDTO(tag);

    await this.tagService.createTag(createTagDTO);

    return { body: { status: 'success', message: 'Tag Created Successfully' } };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  getAllTag = async (httpRequest) => {
    const { page, perPage, showTrashed, q } = httpRequest.query;

    const getAllTagDTO = new GetAllTagDTO(page, perPage, showTrashed, q);
    const tags = await this.tagService.getAllTag(getAllTagDTO);
    return { body: tags };
  };

  getAllPublichTag = async (httpRequest) => {
    const tags = await this.tagService.getAllPublicTag();
    return { body: tags };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  findTag = async (httpRequest) => {
    const { tagId } = httpRequest.params;

    const findTagDTO = new FindTagDTO(tagId);
    const tag = await this.tagService.findTag(findTagDTO);

    return {
      body: {
        status: 'success',
        data: tag,
      },
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  updateTag = async (httpRequest) => {
    const { body } = httpRequest;
    const { tagId } = httpRequest.params;

    const updateTagDTO = new UpdateTagDTO({ ...body, tagId });
    await this.tagService.updateTag(updateTagDTO);

    return {
      body: {
        status: 'success',
        message: 'Tag updated successfully',
      },
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  removeTag = async (httpRequest) => {
    const { tagId } = httpRequest.params;
    const { hardDelete } = httpRequest.query;

    const removeTagDTO = new RemoveTagDTO(tagId, hardDelete);
    await this.tagService.removeTag(removeTagDTO);

    return { body: { status: 'success', message: 'Tag Deleted Successfully' } };
  };
}

export default TagController;
