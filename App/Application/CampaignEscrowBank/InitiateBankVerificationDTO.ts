class InitiateBankVerificationDTO {
  private campaignId: string;
  private campaignEscrowBankId: string;

  constructor(campaignId, campaignEscrowBankId) {
    this.campaignId = campaignId;
    this.campaignEscrowBankId = campaignEscrowBankId;
  }

  getCampaignId() {
    return this.campaignId;
  }

  getCampaignEscrowBankId() {
    return this.campaignEscrowBankId;
  }
}

export default InitiateBankVerificationDTO;
