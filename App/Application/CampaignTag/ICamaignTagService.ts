import CreateCampaignTagDTO from './CreateCampaignTagDTO';
import FindCampaignTagDTO from './FindCampaignTagDTO';
import GetCampaignTagDTO from './GetCampaignTagDTO';
import RemoveCampaignTagDTO from './RemoveCampaignTagDTO';
import CampaignTag from '@domain/Core/CampaignTag/CampaignTag';
import { PaginationDataResponse } from '@domain/Utils/PaginationData';

export const ICampaignTagServiceId = Symbol.for('ICampaignTagService');

export interface ICampaignTagService {
  getCampaignTag(
    getCampaignTagDTO: GetCampaignTagDTO,
  ): Promise<PaginationDataResponse<CampaignTag>>;

  findCampaignTag(findCampaignTagDTO: FindCampaignTagDTO): Promise<CampaignTag>;

  removeCampaignTag(removeCampaignTagDTO: RemoveCampaignTagDTO): Promise<boolean>;

  createCampaignTag(createCampaignTagDTO: CreateCampaignTagDTO): Promise<boolean>;
}
