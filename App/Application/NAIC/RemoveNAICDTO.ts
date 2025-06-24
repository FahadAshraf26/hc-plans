class RemoveNAICDTO {
  private readonly naicId: string;

  constructor(naicId: string) {
    this.naicId = naicId;
  }

  getNAICId() {
    return this.naicId;
  }
}

export default RemoveNAICDTO;
