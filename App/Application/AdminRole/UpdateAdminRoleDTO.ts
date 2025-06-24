import AdminRole from '@domain/Core/AdminRole/AdminRole';

class UpdateAdminRoleDTO {
  private adminRole: AdminRole;

  constructor(adminRoleObj) {
    this.adminRole = AdminRole.createFromObject(adminRoleObj);
  }

  getAdminRole(): AdminRole {
    return this.adminRole;
  }

  getAdminRoleId(): string {
    return this.adminRole.adminRoleId;
  }
}

export default UpdateAdminRoleDTO;
