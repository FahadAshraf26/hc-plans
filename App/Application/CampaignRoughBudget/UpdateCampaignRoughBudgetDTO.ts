import RoughBudget from '../../Domain/Core/CampaignRoughBudget/CampaignRoughBudget';

class UpdateCampaignRoughBudgetDTO {
  private readonly roughBudget: RoughBudget;

  constructor(roughBudgetObj: any) {
    roughBudgetObj.name = JSON.stringify(roughBudgetObj.name);
    roughBudgetObj.value = JSON.stringify(roughBudgetObj.value);
    this.roughBudget = RoughBudget.createFromObject(roughBudgetObj);
  }

  getCampaignId() {
    return this.roughBudget.campaignId;
  }

  getRoughBudgetId() {
    return this.roughBudget.roughBudgetId;
  }

  getRoughBudget() {
    return this.roughBudget;
  }
}

export default UpdateCampaignRoughBudgetDTO;
