import { ProjectionReturns } from '@domain/Core/ProjectionReturns/ProjectionReturns';
import { PaginationDataResponse } from '@domain/Utils/PaginationData';
import { FetchInvestorCampaignProjectionsDTO } from './FetchInvestorCampaignProjectionsDTO';
import { FetchInvestorProjectionsDTOWithPagination } from './FetchInvestorProjectionsDTOWithPagination';
import { FetchInvestorProjectionsDTOWithoutPagination } from './FetchInvestorProjectionsDTOWithoutPagination';
import UploadProjectionReturnsDTO from '@application/ProjectionReturns/UploadProjectionReturnsDTO';
import DeleteProjectionReturnsDTO from '@application/ProjectionReturns/DeleteProjectionReturnsDTO';

export const IProjectionReturnsServiceId = Symbol.for('IProjectionReturnsService');

export interface IProjectionReturnsService {
  getAllInvestorCampaignProjections(
    fetchInvestorCampaignProjectionsDTO: FetchInvestorCampaignProjectionsDTO,
  ): Promise<ProjectionReturns[]>;

  getAllInvestorProjectionsWithPagination(fetchInvestorProjectionsDTOWithPagination: FetchInvestorProjectionsDTOWithPagination): Promise<any>;
  getAllInvestorProjectionsWithoutPagination(fetchInvestorProjectionsDTOWithoutPagination: FetchInvestorProjectionsDTOWithoutPagination): Promise<any>
  getInvestorsProjections(): Promise<any>
  getAllInvestorsProjections(): Promise<any>
  uploadProjectionReturns(uploadProjectionReturnsDTO: UploadProjectionReturnsDTO): Promise<any>;
  deleteCampaignsProjectionReturns(campaignIds):Promise<any>;
  getUploadProjectionReturnsTemplate(): Promise<any>;
}
