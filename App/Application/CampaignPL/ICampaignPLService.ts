import GetCampaignPLDTO from '@application/CampaignPL/GetCampaignPLDTO';
import CampaignPL from '@domain/Core/CampaignPL/CampaignPL';
import FindCampaignPLDTO from '@application/CampaignPL/FindCampaignPLDTO';
import UpdateCampaignPLDTO from '@application/CampaignPL/UpdateCampaignPLDTO';
import RemoveCampaignPLDTO from '@application/CampaignPL/RemoveCampaignPLDTO';
import CreateCampaignPLDTO from '@application/CampaignPL/CreateCampaignPLDTO';

export const ICampaignPLServiceId = Symbol.for('ICampaignPLService');
export interface ICampaignPLService {
  getPL(getPLDTO: GetCampaignPLDTO): Promise<CampaignPL>;
  findPL(findPLDTO: FindCampaignPLDTO): Promise<CampaignPL>;
  updatePL(updatePLDTO: UpdateCampaignPLDTO): Promise<boolean>;
  removePL(removePLDTO: RemoveCampaignPLDTO): Promise<boolean>;
  createPL(createPLDTO: CreateCampaignPLDTO): Promise<boolean>;
}
