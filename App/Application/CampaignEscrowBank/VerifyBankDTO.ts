class VerifyBankDTO {
  private campaignId: string;
  private campaignEscrowBankId: string;
  private firstTransactionAmount: string;
  private secondTransactionAmount: string;

  constructor(
    campaignId,
    campaignEscrowBankId,
    firstTransactionAmount,
    secondTransactionAmount,
  ) {
    this.campaignId = campaignId;
    this.campaignEscrowBankId = campaignEscrowBankId;
    this.firstTransactionAmount = firstTransactionAmount;
    this.secondTransactionAmount = secondTransactionAmount;
  }

  getCampaignId() {
    return this.campaignId;
  }

  getCampaignEscrowBankId() {
    return this.campaignEscrowBankId;
  }

  getFirstTransactionAmount() {
    return this.firstTransactionAmount;
  }

  getSecondTransactionDTO() {
    return this.secondTransactionAmount;
  }
}

export default VerifyBankDTO;
