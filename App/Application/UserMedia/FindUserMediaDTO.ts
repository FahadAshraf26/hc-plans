class FindUserMediaDTO {
  private userMediaId: string;

  constructor(userMediaId) {
    this.userMediaId = userMediaId;
  }

  getUserMediaId() {
    return this.userMediaId;
  }
}

export default FindUserMediaDTO;
