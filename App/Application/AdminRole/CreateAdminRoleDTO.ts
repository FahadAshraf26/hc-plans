import AdminRole from '@domain/Core/AdminRole/AdminRole';

class CreateAdminDTO {
  private adminRole: AdminRole;

  constructor(name: string) {
    this.adminRole = AdminRole.createFromDetail(name);
  }

  getAdminRole(): AdminRole {
    return this.adminRole;
  }
}

export default CreateAdminDTO;
