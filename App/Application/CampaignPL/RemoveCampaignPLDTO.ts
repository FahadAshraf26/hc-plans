class RemoveCampaignPLDTO {
  private readonly plId: string;
  private readonly hardDelete: string;

  constructor(plId: string, hardDelete: string = 'false') {
    this.plId = plId;
    this.hardDelete = hardDelete;
  }

  getPLId() {
    return this.plId;
  }

  shouldHardDelete() {
    return this.hardDelete === 'true';
  }
}

export default RemoveCampaignPLDTO;
