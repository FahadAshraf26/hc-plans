class RefreshTokenDTO {
  private readonly refreshToken: string;

  constructor(refreshToken: string) {
    this.refreshToken = refreshToken;
  }

  getRefreshToken() {
    return this.refreshToken;
  }
}

export default RefreshTokenDTO;
