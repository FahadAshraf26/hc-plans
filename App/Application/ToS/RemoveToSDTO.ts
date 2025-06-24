class RemoveToSDTO {
  private tosId: string;
  private hardDelete: string;

  constructor(tosId: string, hardDelete: string) {
    this.tosId = tosId;
    this.hardDelete = hardDelete;
  }

  getToSId(): string {
    return this.tosId;
  }

  shouldHardDelete(): boolean {
    return this.hardDelete === 'true';
  }
}

export default RemoveToSDTO;
