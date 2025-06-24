class GetUserInfoDTO {
  userId: string;
  showTrashed: string;

  constructor(userId: string, showTrashed: string = 'false') {
    this.userId = userId;
    this.showTrashed = showTrashed;
  }

  /**
   *
   * @return {string}
   */
  getUserId() {
    return this.userId;
  }

  shouldShowTrashed() {
    return !!this.showTrashed !== false && this.showTrashed === 'true';
  }
}

export default GetUserInfoDTO;
