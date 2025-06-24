import TagCategoryService from '@application/TagCategory/TagCategoryService';
import CreateTagCategoryDTO from '@application/TagCategory/CreateTagCategoryDTO';
import GetAllTagCategoryDTO from '@application/TagCategory/GetAllTagCategoryDTO';
import FindTagCategoryDTO from '@application/TagCategory/FindTagCategoryDTO';
import UpdateTagCategoryDTO from '@application/TagCategory/UpdateTagCategoryDTO';
import RemoveTagCategoryDTO from '@application/TagCategory/RemoveTagCategoryDTO';
import { injectable } from 'inversify';

/**
 * @typedef {import('../Utils/makeExpressCallback').HttpRequest} HttpRequest
 * @typedef {import('../Utils/makeExpressCallback').HttpResponse} HttpResponse
 */

@injectable()
class TagCategoryController {
  constructor(private tagCategoryService: TagCategoryService) {}
  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  createTagCategory = async (httpRequest) => {
    const { category } = httpRequest.body;

    const createTagCategoryDTO = new CreateTagCategoryDTO(category);

    await this.tagCategoryService.createTagCategory(createTagCategoryDTO);

    return { body: { status: 'success', message: 'Tag Category Created Successfully' } };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  getAllTagCategory = async (httpRequest) => {
    const { page, perPage, showTrashed, q } = httpRequest.query;

    const getAllTagCategoryDTO = new GetAllTagCategoryDTO(page, perPage, showTrashed, q);
    const tagCategories = await this.tagCategoryService.getAllTagCategories(
      getAllTagCategoryDTO,
    );
    return { body: tagCategories };
  };

  getAllPublichTagCategories = async (httpRequest) => {
    const tagCategories = await this.tagCategoryService.getAllPublicTagCategories();
    return { body: tagCategories };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  findTagCategory = async (httpRequest) => {
    const { tagCategoryId } = httpRequest.params;

    const findTagCategoryDTO = new FindTagCategoryDTO(tagCategoryId);
    const tagCategory = await this.tagCategoryService.findTagCategory(findTagCategoryDTO);

    return {
      body: {
        status: 'success',
        data: tagCategory,
      },
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  updateTagCategory = async (httpRequest) => {
    const { body } = httpRequest;
    const { tagCategoryId } = httpRequest.params;

    const updateTagCategoryDTO = new UpdateTagCategoryDTO({ ...body, tagCategoryId });
    await this.tagCategoryService.updateTagCategory(updateTagCategoryDTO);

    return {
      body: {
        status: 'success',
        message: 'Tag Category updated successfully',
      },
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  removeTagCategory = async (httpRequest) => {
    const { tagCategoryId } = httpRequest.params;
    const { hardDelete } = httpRequest.query;

    const removeTagCategoryDTO = new RemoveTagCategoryDTO(tagCategoryId, hardDelete);
    await this.tagCategoryService.removeTagCategory(removeTagCategoryDTO);

    return { body: { status: 'success', message: 'Tag Category Deleted Successfully' } };
  };
}

export default TagCategoryController;
