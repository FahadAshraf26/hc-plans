class CreateLoanwellDTO {
  private files: any;
  private adminUserName: any;
  constructor(files: any, adminUserName: string) {
    this.files = files;
    this.adminUserName = adminUserName;
  }

  getFiles() {
    return this.files;
  }

  getAdminUser() {
    return this.adminUserName;
  }
}

export default CreateLoanwellDTO;
