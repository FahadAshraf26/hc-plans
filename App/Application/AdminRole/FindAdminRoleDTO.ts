class FindAdminRoleDTO {
  private adminRoleId: string;

  constructor(adminRoleId: string) {
    this.adminRoleId = adminRoleId;
  }

  getAdminRoleId(): string {
    return this.adminRoleId;
  }
}

export default FindAdminRoleDTO;
