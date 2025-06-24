class UpdatePasswordTokenDTO {
  private readonly userId: string;
  private readonly password: string;

  constructor(userId: string, password: string) {
    this.userId = userId;
    this.password = password;
  }

  getPassword() {
    return this.password;
  }

  getUserId() {
    return this.userId;
  }
}

export default UpdatePasswordTokenDTO;
