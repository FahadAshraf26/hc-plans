class FacebookLoginDTO {
  private readonly token: string;

  constructor(token: string) {
    this.token = token;
  }

  getAuthToken() {
    return this.token;
  }
}

export default FacebookLoginDTO;
