import AdminUser from '../../Domain/Core/AdminUser/AdminUser';

class CreateAdminDTO {
  private admin: AdminUser;

  constructor(name: string, email: string, adminRoleId: string, password: string) {
    this.admin = AdminUser.createFromDetail(name, email, adminRoleId);
    this.admin.setPassword(password);
  }

  getAdminUser(): AdminUser {
    return this.admin;
  }

  getAdminUserId(): string {
    return this.admin.adminUserId;
  }

  getPassword(): string {
    return this.admin.password;
  }

  setPassword(password: string) {
    this.admin.setPassword(password);
  }
}

export default CreateAdminDTO;
