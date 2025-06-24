class GetUserDTO {
  private readonly userId: string;

  constructor(userId: string) {
    this.userId = userId;
  }

  /**
   *
   * @return {string}
   */
  getUserId() {
    return this.userId;
  }
}

export default GetUserDTO;
