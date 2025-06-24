import AdminUser from '../../Domain/Core/AdminUser/AdminUser';

class UpdateAdminDTO {
  private admin: AdminUser;

  constructor(adminObj) {
    this.admin = AdminUser.createFromObject(adminObj);
    if (adminObj.password) {
      this.admin.setPassword(adminObj.password);
    }
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
    return this.admin.setPassword(password);
  }
}

export default UpdateAdminDTO;
