class InstagramLoginDTO {
  private readonly userName: string;

  constructor(userName: string) {
    this.userName = userName;
  }

  getUserName() {
    return this.userName;
  }
}

export default InstagramLoginDTO;
