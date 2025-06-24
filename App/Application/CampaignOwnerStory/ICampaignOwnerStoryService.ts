import CreateCampaignOwnerStoryDTO from './CreateCampaignOwnerStoryDTO';
import FindCampaignOwnerStoryDTO from './FindCampaignOwnerStoryDTO';
import GetCampaignOwnerStoryDTO from './GetCampaignOwnerStoryDTO';
import RemoveCampaignOwnerStoryDTO from './RemoveCampaignOwnerStoryDTO';
import GetCampaignOwnerStoryByCampaignDTO from './GetCampaignOwnerStoryByCampaignDTO';
import UpdateCampaignOwnerStoryDTO from './UpdateCampaignOwnerStoryDTO';
import CampaignOwnerStory from '@domain/Core/CampaignOwnerStory/CampaignOwnerStory';
import { PaginationDataResponse } from '@domain/Utils/PaginationData';
export const ICampaignOwnerStoryServiceId = Symbol.for('ICampaignOwnerStoryService');

export interface ICampaignOwnerStoryService {
  createCampaignOwnerStory(
    createCampaignOwnerStoryDTO: CreateCampaignOwnerStoryDTO,
  ): Promise<boolean>;
  getCampaignOwnerStories(
    getCampaignOwnerStoryDTO: GetCampaignOwnerStoryDTO,
  ): Promise<PaginationDataResponse<any>>;
  getOwnerStoriesByCampaign(
    getOwnerStoriesByCampaignDTO: GetCampaignOwnerStoryByCampaignDTO,
  ): Promise<PaginationDataResponse<CampaignOwnerStory>>;
  findCampaignOwnerStory(
    findCampaignOwnerStoryDTO: FindCampaignOwnerStoryDTO,
  ): Promise<CampaignOwnerStory>;
  updateCampaignOwnerStory(
    updateCampaignOwnerStoryDTO: UpdateCampaignOwnerStoryDTO,
  ): Promise<boolean>;
  removeCampaignOwnerStory(
    removeCampaignOwnerStoryDTO: RemoveCampaignOwnerStoryDTO,
  ): Promise<boolean>;
}
