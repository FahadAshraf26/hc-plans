class AdminLoginDTO {
  private readonly email: string;
  private readonly password: string;

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }

  /**
   *
   * @return {string}
   */
  getEmail() {
    return this.email;
  }

  /**
   *
   * @return {string}
   */
  getPassword() {
    return this.password;
  }
}

export default AdminLoginDTO;
