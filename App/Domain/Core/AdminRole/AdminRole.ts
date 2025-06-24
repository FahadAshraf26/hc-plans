import uuid from 'uuid/v4';

class AdminRole {
  adminRoleId: string;
  private name: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(adminRoleId: string, name: string) {
    this.adminRoleId = adminRoleId;
    this.name = name;
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
   * @param {object} adminRoleObj
   * @returns AdminRole
   */
  static createFromObject(adminRoleObj) {
    const adminRole = new AdminRole(adminRoleObj.adminRoleId, adminRoleObj.name);

    if (adminRole.createdAt) {
      adminRole.setCreatedAt(adminRole.createdAt);
    }

    if (adminRole.updatedAt) {
      adminRole.setUpdatedAt(adminRole.updatedAt);
    }

    return adminRole;
  }

  /**
   *
   * @param {string} name
   * @returns AdminRole
   */
  static createFromDetail(name: string) {
    return new AdminRole(uuid(), name);
  }
}

export default AdminRole;
