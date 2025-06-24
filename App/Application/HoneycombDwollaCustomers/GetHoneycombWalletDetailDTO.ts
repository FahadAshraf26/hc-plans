class GetHoneycombWalletDetailDTO {
  private userId: string;
  constructor(userId: string) {
    this.userId = userId;
  }

  getUserId() {
    return this.userId;
  }
}

export default GetHoneycombWalletDetailDTO;
