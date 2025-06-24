import GetCampaignRoughBudgetDTO from '@application/CampaignRoughBudget/GetCampaignRoughBudgetDTO';
import CampaignRoughBudget from '@domain/Core/CampaignRoughBudget/CampaignRoughBudget';
import FindCampaignRoughBudgetDTO from '@application/CampaignRoughBudget/FindCampaignRoughBudgetDTO';
import UpdateCampaignRoughBudgetDTO from '@application/CampaignRoughBudget/UpdateCampaignRoughBudgetDTO';
import RemoveCampaignRoughBudgetDTO from '@application/CampaignRoughBudget/RemoveCampaignRoughBudgetDTO';
import CreateCampaignRoughBudgetDTO from '@application/CampaignRoughBudget/CreateCampaignRoughBudgetDTO';

export const ICampaignRoughBudgetServiceId = Symbol.for('ICampaignRoughBudgetService');
export interface ICampaignRoughBudgetService {
  getRoughBudget(
    getRoughBudgetDTO: GetCampaignRoughBudgetDTO,
  ): Promise<CampaignRoughBudget>;
  findRoughBudget(
    findRoughBudgetDTO: FindCampaignRoughBudgetDTO,
  ): Promise<CampaignRoughBudget>;
  updateRoughBudget(updateRoughBudgetDTO: UpdateCampaignRoughBudgetDTO): Promise<boolean>;
  removeRoughBudget(removeRoughBudgetDTO: RemoveCampaignRoughBudgetDTO): Promise<boolean>;
  createRoughBudget(createRoughBudgetDTO: CreateCampaignRoughBudgetDTO): Promise<boolean>;
}
