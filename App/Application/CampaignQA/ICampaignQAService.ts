import GetCampaignQADTO from '@application/CampaignQA/GetCampaignQADTO';
import PaginationData from '@domain/Utils/PaginationData';
import FindCampaignQADTO from '@application/CampaignQA/FindCampaignQADTO';
import CampaignQA from '@domain/Core/CampaignQA/CampaignQA';
import UpdateCampaignQADTO from '@application/CampaignQA/UpdateCampaignQADTO';
import RemoveCampaignQADTO from '@application/CampaignQA/RemoveCampaignQADTO';
import CreateCampaignQADTO from '@application/CampaignQA/CreateCampaignQADTO';

export const ICampaignQAServiceId = Symbol.for('ICampaignQAServiceId');

export interface ICampaignQAService {
  getCampaignQA(getCampaignQADTO: GetCampaignQADTO): Promise<PaginationData<any>>;
  findCampaignQA(findCampaignQADTO: FindCampaignQADTO): Promise<CampaignQA>;
  updateCampaignQA(updateCampaignQADTO: UpdateCampaignQADTO): Promise<any>;
  removeCampaignQA(removeCampaignQADTO: RemoveCampaignQADTO): Promise<any>;
  createCampaignQA(createCampaignQADTO: CreateCampaignQADTO): Promise<any>;
}
