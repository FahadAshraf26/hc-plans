import CampaignFund from '@domain/Core/CampaignFunds/CampaignFund';
import PaginationData from '@domain/Utils/PaginationData';
import PaginationOptions from '@domain/Utils/PaginationOptions';

export const ICampaignFundRepositoryId = Symbol.for('ICampaignFundRepository');

type fetchInvestorInvestmentOnCampaignsWithPagination = {
  paginationOptions: PaginationOptions;
  investorId: string;
};

type fetchInvestorInvestmentOnCampaignsWithOutPagination = {
  investorId: string;
};

type fetchInvestorCampaignInvestment = {
  investorId: string;
  campaignId: string;
  paginationOptions: PaginationOptions;
};

export interface ICampaignFundRepository {
  fetchTotalAmountOfCampaigns(
    quarterStartDate,
    quarterEndDate,
    yearStartDate,
    currentDate,
  ): Promise<any>;
  fetchTotalAmountOfActiveCampaigns(): Promise<any>;
  createPaginationResponse(
    paginationOptions,
    rows: number,
    count: number,
  ): PaginationData<any>;
  add(campaignFund: CampaignFund): Promise<boolean>;
  fetchAll(paginationOptions, showTrashed: string): Promise<any>;
  fetchByCampaign(
    campaignId: string,
    paginationOptions,
    showTrashed: boolean | undefined,
    query: any,
  ): Promise<any>;
  fetchAllCampaignsInvestments(
    showTrashed: boolean | undefined,
    query: any,
  ): Promise<any>;
  fetchSumInvestmentByCampaign(
    campaignId: string,
    investmentType?: string | undefined,
    includePending?: boolean,
  ): Promise<number>;
  fetchCountByCampaign(
    campaignId?: string,
    countRefunded?: boolean,
    distinctOnly?: boolean,
    includePending?: boolean,
  ): Promise<number>;
  fetchRefundRequestedCountByCampaign(campaignId: string): Promise<number>;
  fetchSumByInvestorAndDate(investorId: string, date: Date): Promise<number>;
  fetchAllByCampaignWithSuccessfulCharges(
    campaignId: string,
  ): Promise<Array<CampaignFund>>;
  fetchByInvestorAndDate(investorId: string, date: Date): Promise<Array<CampaignFund>>;
  fetchAllByInvestor(
    investorId: string,
    completedOnly?: boolean,
    entityId?: string,
  ): Promise<Array<CampaignFund>>;
  fetchByInvestor(
    investorId: string,
    paginationOptions,
    showTrashed: boolean,
    includePending: boolean,
    includeFailed: boolean,
    includeRefunded: boolean,
    entityId: string | boolean,
  ): Promise<any>;
  fetchByInvestorAndGroupByCampaignId(options: {}): Promise<any>;
  fetchAccumulatedInvestmentsByInvestor(options: {}): Promise<any>;
  hasInvestmentByCriteria(options: {}): Promise<boolean>;
  fetchByCampaignAndGroupByInvestorId(options: {}): Promise<any>;
  fetchByInvestorIdAndCampaignId(
    investorId: string,
    campaignId: string,
    findDeleted?: boolean,
  ): Promise<false | CampaignFund>;
  fetchById(campaignFundId: string): Promise<false | CampaignFund>;
  fetchInvestorSum(
    investorId: string,
    investmentType?: string | undefined,
  ): Promise<number>;
  fetchReport(startDate: any, endDate: any, campaignId: string): Promise<any>;
  update(campaignFund: CampaignFund): Promise<boolean>;
  remove(campaignFund: CampaignFund, hardDelete?: boolean): Promise<boolean>;
  fetchByChargeId(chargeId: string): Promise<CampaignFund>;
  fetchAllByCampaignWithSuccessfulChargesAndWithoutDocumentSent(
    campaignId: string,
  ): Promise<any>;
  fetchAllInvesmentsByInvestorIdAndEntity(
    investorId: string,
    entityId: string,
  ): Promise<any>;
  fetchByEntityIdAndCampaignId(
    investorId: string,
    campaignId: string,
    findDeleted?: boolean,
  ): Promise<false | CampaignFund>;
  updateWefunder(campaignFund): Promise<boolean>;
  fetchInvestorFundsOnly(investorId: string): Promise<Array<CampaignFund>>;
  fetchInvestorInvestmentOnCampaignsWithPagination({
    paginationOptions,
    investorId,
  }: fetchInvestorInvestmentOnCampaignsWithPagination): Promise<any>;
  fetchInvestorInvestmentOnCampaignsWithOutPagination({
    investorId,
  }: fetchInvestorInvestmentOnCampaignsWithOutPagination): Promise<any>;
  fetchInvestorCampaignInvestment({
    investorId,
    campaignId,
    paginationOptions,
  }: fetchInvestorCampaignInvestment): Promise<any>;
  fetchByCampaignToExport(campaignId: string): Promise<any>;
  fetchByCampaignForNotification(campaignId: string): Promise<any>;
  fetchAllByInvestorId(investorId: string, entityId: string | null): Promise<any>;
  fetchByCampaignForRefund(campaignId: string): Promise<any>;
  fetchByInvestorAndCampaignId({
    investorId,
    paginationOptions,
    showTrashed,
    entityId,
  }): Promise<any>;
  getInvestorPortfolioInvestments(investorId: string, entityId?: string): Promise<any>;
  getJobSupported(investorId: string, entityId?: string): Promise<any>;
  fetchMultipleCampaignsReport(
    startDate,
    endDate,
    campaignNames,
    campaignStatuses,
  ): Promise<any>;
  fetchSumInvestmentByCampaignsReport(
    campaignNames,
    includePending,
    campaignStatuses,
    startDate,
    endDate,
  ): Promise<any>;
  countInvestorInvestments(investorId: string): Promise<number>;
  countInvestorInvestmentsByCampaign(
    investorId: string,
    campaignId: string,
  ): Promise<number>;
  countPromotionCreditsInvesments(investorId: string);
}
