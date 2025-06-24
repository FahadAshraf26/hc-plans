class ReconfirmOfferingChangeDTO {
  private campaignOfferingChangeId: string;

  constructor(campaignOfferingChangeId: string) {
    this.campaignOfferingChangeId = campaignOfferingChangeId;
  }

  getcampaignOfferingChangeId() {
    return this.campaignOfferingChangeId;
  }
}

export default ReconfirmOfferingChangeDTO;
