import PaginationOptions from '@domain/Utils/PaginationOptions';
import PaginationData from '@domain/Utils/PaginationData';

type fetchProjectionsByInvestorCampaign = {
  paginationOptions: PaginationOptions;
  investorId: string;
  campaignId: string;
  entityId: string;
};

type fetchProjectionsByInvestorWithPagination = {
  paginationOptions: PaginationOptions;
  investorId: string;
};
type fetchProjectionsByInvestorWithoutPagination = {
  investorId: string;
};

export const IProjectionReturnsRepositoryId = Symbol.for('IProjectionReturnsRepository');
export interface IProjectionReturnsRepository {
  add(projectionReturn): Promise<boolean>;
  fetchProjectionsByInvestorCampaign({
    paginationOptions,
    investorId,
    campaignId,
    entityId,
  }: fetchProjectionsByInvestorCampaign): Promise<any>;

  fetchProjectionsByInvestorWithPagination({
    paginationOptions,
    investorId,
  }: fetchProjectionsByInvestorWithPagination): Promise<any>;

  fetchProjectionsByInvestorWithoutPagination({
    investorId,
  }: fetchProjectionsByInvestorWithoutPagination): Promise<any>;

  fetchInvestorsProjections(): Promise<any>;
  fetchAllInvestorsProjections(): Promise<any>;
  deleteProjectionReturnsByInvestorPaymentIds(investorPaymentsIds: string[]): Promise<any>;
}
