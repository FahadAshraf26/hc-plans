import CreateAdminDTO from '../../Application/Admin/CreateAdminDTO';
import FindAdminDTO from '../../Application/Admin/FindAdminDTO';
import GetAdminDTO from '../../Application/Admin/GetAdminDTO';
import UpdateAdminDTO from '../../Application/Admin/UpdateAdminDTO';
import RemoveAdminDTO from '../../Application/Admin/RemoveAdminDTO';
import AdminService from '../../Application/Admin/AdminService';
import { injectable } from 'inversify';

/**
 * @typedef {import('../Utils/makeExpressCallback').HttpRequest} HttpRequest
 * @typedef {import('../Utils/makeExpressCallback').HttpResponse} HttpResponse
 */

@injectable()
class AdminUserController {
  constructor(private adminService: AdminService) {}
  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  createAdmin = async (httpRequest) => {
    const { name, email, password, adminRoleId } = httpRequest.body;
    const input = new CreateAdminDTO(name, email, adminRoleId, password);
    await this.adminService.createAdmin(input);

    return {
      body: {
        status: 'success',
        message: 'admin created successfully',
      },
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  findAdmin = async (httpRequest) => {
    const { adminUserId } = httpRequest.params;

    const input = new FindAdminDTO(adminUserId);
    const admin = await this.adminService.findAdmin(input);

    return {
      body: {
        status: 'success',
        data: admin,
      },
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  updateAdmin = async (httpRequest) => {
    const { adminUserId } = httpRequest.params;
    const { body } = httpRequest;

    const input = new UpdateAdminDTO({ ...body, adminUserId });
    await this.adminService.updateAdmin(input);

    return {
      body: {
        status: 'success',
        message: 'admin updated successfully',
      },
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  removeAdmin = async (httpRequest) => {
    const { adminUserId } = httpRequest.params;

    const input = new RemoveAdminDTO(adminUserId);
    await this.adminService.removeAdmin(input);

    return {
      body: {
        status: 'success',
        message: 'admin deleted successfully',
      },
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  getAdmin = async (httpRequest) => {
    const { page, perPage } = httpRequest.query;

    const input = new GetAdminDTO(page, perPage);
    const adminUsers = await this.adminService.getAdmin(input);

    return { body: adminUsers };
  };
}

export default AdminUserController;
