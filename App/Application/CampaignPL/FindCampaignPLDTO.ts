class FindPLDTO {
  private readonly plId: string;

  constructor(plId: string) {
    this.plId = plId;
  }

  getPLId() {
    return this.plId;
  }
}

export default FindPLDTO;
