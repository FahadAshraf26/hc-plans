import Campaign from '@domain/Core/Campaign/Campaign';
import { IBaseRepository } from '@domain/Core/BaseEntity/IBaseRepository';
import PaginationData from '@domain/Utils/PaginationData';
import PaginationOptions from '@domain/Utils/PaginationOptions';

export const ICampaignRepositoryId = Symbol.for('ICampaignRepository');

export interface ICampaignRepository extends IBaseRepository {
  fetchActiveCampaigns(): Promise<Campaign>;

  fetchAll({ paginationOptions, options }): Promise<PaginationData<Campaign>>;

  fetchByIssuerId(
    issuerId: string,
    paginationOptions,
    showTrashed: boolean,
  ): Promise<PaginationData<Campaign>>;

  getFavoriteCampaign(
    investorId: string,
    paginationOptions,
    showTrashed: boolean,
  ): Promise<any>;

  fetchById(
    campaignId: string,
    isAdminRequest?: boolean,
    investorId?: string,
  ): Promise<Campaign>;

  fetchSuccessfulCampigns?(): Promise<Array<Campaign>>;

  fetchSuccessfulCampignById?(
    campaignId: string,
    options: {
      ignoreCampaignStage: boolean;
      campaignStage: string;
      includePendingCharges: boolean;
    },
  ): Promise<Campaign>;

  getOwnerCampaigns(userId: string, paginationOptions): Promise<any>;

  fetchByExpirationDate(
    date: string,
    options: { includeInterestedInvestor?: boolean; campaignStage?: string | undefined },
  ): Promise<Array<Campaign>>;

  fetchPublicOppurtunities(options: {
    paginationOptions;
    showTrashed: boolean;
    campaignStage: string;
  }): Promise<any>;

  fetchCampaignInfoById(campaignId: string): Promise<Campaign>;

  fetchBySlug(slug: string, isAdminRequest: boolean): Promise<Campaign>;
  checkNameAvailbility(campaignName: string): Promise<Campaign>;
  fetchAllByIssuerId(issuerId: string): Promise<any>;
  fetchAllForAdmin({ paginationOptions, options }): Promise<PaginationData<Campaign>>;
  fetchAllCampaignTags(): Promise<any>;
  getAllFCCampaigns(): Promise<any>;
  fetchAllCampaignNames(): Promise<string[]>;
  getCampaignsWithRepayments(search: string, paginationOptions: PaginationOptions):Promise<any>;
  getCampaignsWithProjectionReturns(search: string, paginationOptions: PaginationOptions):Promise<any>;
  fetchAllCampaigns(): Promise<any>;
}
