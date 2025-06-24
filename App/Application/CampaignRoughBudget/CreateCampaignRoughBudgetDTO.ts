import RoughBudget from '../../Domain/Core/CampaignRoughBudget/CampaignRoughBudget';

class CreateCampaignRoughBudgetDTO {
  private readonly roughBudget: RoughBudget;

  constructor(roughBudget: any, campaignId: string) {
    this.roughBudget = RoughBudget.createFromDetail(roughBudget, campaignId);
  }

  getCampaignId() {
    return this.roughBudget.campaignId;
  }

  getRoughBudget() {
    return this.roughBudget;
  }
}

export default CreateCampaignRoughBudgetDTO;
