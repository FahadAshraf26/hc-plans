import CreateAdminRoleDTO from '../../Application/AdminRole/CreateAdminRoleDTO';
import FindAdminRoleDTO from '../../Application/AdminRole/FindAdminRoleDTO';
import GetAdminRoleDTO from '../../Application/AdminRole/GetAdminRoleDTO';
import UpdateAdminRoleDTO from '../../Application/AdminRole/UpdateAdminRoleDTO';
import RemoveAdminRoleDTO from '../../Application/AdminRole/RemoveAdminRoleDTO';
import AdminRoleService from '../../Application/AdminRole/AdminRoleService';
import { injectable } from 'inversify';

/**
 * @typedef {import('../Utils/makeExpressCallback').HttpRequest} HttpRequest
 * @typedef {import('../Utils/makeExpressCallback').HttpResponse} HttpResponse
 */

@injectable()
class AdminController {
  constructor(private adminRoleService: AdminRoleService) {}
  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  createAdminRole = async (httpRequest) => {
    const { name } = httpRequest.body;

    const input = new CreateAdminRoleDTO(name);
    await this.adminRoleService.createAdminRole(input);

    return {
      body: {
        status: 'success',
        message: 'admin role created successfully',
      },
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  findAdminRole = async (httpRequest) => {
    const { adminRoleId } = httpRequest.params;

    const input = new FindAdminRoleDTO(adminRoleId);
    const adminRole = await this.adminRoleService.findAdminRole(input);

    return {
      body: {
        status: 'success',
        data: adminRole,
      },
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  updateAdminRole = async (httpRequest) => {
    const { adminRoleId } = httpRequest.params;
    const { body } = httpRequest;

    const input = new UpdateAdminRoleDTO({ ...body, adminRoleId });
    await this.adminRoleService.updateAdminRole(input);

    return {
      body: {
        status: 'success',
        message: 'admin role updated successfully',
      },
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  removeAdminRole = async (httpRequest) => {
    const { adminRoleId } = httpRequest.params;

    const input = new RemoveAdminRoleDTO(adminRoleId);
    await this.adminRoleService.removeAdminRole(input);

    return {
      body: {
        status: 'success',
        message: 'admin role deleted successfully',
      },
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  getAdminRole = async (httpRequest) => {
    const { page, perPage } = httpRequest.query;

    const input = new GetAdminRoleDTO(page, perPage);
    const adminRoles = await this.adminRoleService.getAdminRole(input);

    return { body: adminRoles };
  };
}

export default AdminController;
