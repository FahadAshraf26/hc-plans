import GetAllCampaignsDTO from '@application/Campaign/getAllCampaigns/GetAllCampaignsDTO';
import { PaginationDataResponse } from '@domain/Utils/PaginationData';
import Campaign from '@domain/Core/Campaign/Campaign';

export const IGetAllCampaignsUseCaseId = Symbol.for('IGetAllCampaignsUseCase');

export interface IGetAllCampaignsUseCase {
  execute(getCampaignsDTO: GetAllCampaignsDTO): Promise<PaginationDataResponse<Campaign>>;
}
