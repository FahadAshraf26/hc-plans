class FindToSDTO {
  private tosId: string;

  constructor(tosId: string) {
    this.tosId = tosId;
  }

  getToSId(): string {
    return this.tosId;
  }
}

export default FindToSDTO;
