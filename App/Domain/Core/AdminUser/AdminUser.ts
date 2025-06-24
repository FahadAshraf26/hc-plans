import uuid from 'uuid/v4';
import AdminRole from '../AdminRole/AdminRole';

class AdminUser {
  adminUserId: string;
  private readonly name: string;
  private readonly email: string;
  private readonly adminRoleId: string;
  password: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(adminUserId: string, name: string, email: string, adminRoleId: string) {
    this.adminUserId = adminUserId;
    this.name = name;
    this.email = email;
    this.adminRoleId = adminRoleId;
  }

  setPassword(password: string) {
    this.password = password;
  }

  setRole(role) {
    this.role = role;
  }

  getName() {
    return this.name;
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
   *
   * @param {object} adminUserObj
   * @returns AdminUser
   */
  static createFromObject(adminUserObj) {
    const adminUser = new AdminUser(
      adminUserObj.adminUserId,
      adminUserObj.name,
      adminUserObj.email,
      adminUserObj.adminRoleId,
    );

    if (adminUserObj.role) {
      adminUser.setRole(AdminRole.createFromObject(adminUserObj.role));
    }

    if (adminUser.createdAt) {
      adminUser.setCreatedAt(adminUser.createdAt);
    }

    if (adminUser.updatedAt) {
      adminUser.setUpdatedAt(adminUser.updatedAt);
    }

    return adminUser;
  }

  /**
   *
   * @param {string} name
   * @param {string} email
   * @param adminRoleId
   * @returns AdminUser
   */
  static createFromDetail(name, email, adminRoleId) {
    return new AdminUser(uuid(), name, email, adminRoleId);
  }
}

export default AdminUser;
