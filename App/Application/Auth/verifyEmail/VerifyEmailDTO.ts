class VerifyEmailDTO {
  private readonly token: string;

  constructor(token: string) {
    this.token = token;
  }

  getToken() {
    return this.token;
  }
}

export default VerifyEmailDTO;
