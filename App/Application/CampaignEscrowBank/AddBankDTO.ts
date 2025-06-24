import CampaignEscrowBank from '../../Domain/Core/CampaignEscrowBank/CampaignEscrowBank';

class AddBankDTO {
  private readonly campaignEscrowBank: any;

  constructor(campaignId, routingNumber, accountNumber, subAccountNumber, emailContact) {
    this.campaignEscrowBank = CampaignEscrowBank.createFromDetail(
      campaignId,
      routingNumber,
      accountNumber,
      subAccountNumber,
      emailContact,
    );
  }

  getCampaignEscrowBank() {
    return this.campaignEscrowBank;
  }
}

export default AddBankDTO;
