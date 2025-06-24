class InitiateMicroDepositeDTO {
  private dwollaSourceId: string;

  constructor(dwollaSourceId: string) {
    this.dwollaSourceId = dwollaSourceId;
  }

  getDwollaSourceId() {
    return this.dwollaSourceId;
  }
}

export default InitiateMicroDepositeDTO;
