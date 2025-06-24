class RemoveAdminDTO {
  private adminUserId: string;
  constructor(adminUserId: string) {
    this.adminUserId = adminUserId;
  }

  getAdminUserId(): string {
    return this.adminUserId;
  }
}

export default RemoveAdminDTO;
