import Investor from '@domain/Core/Investor/Investor';
import CampaignFund from '@domain/Core/CampaignFunds/CampaignFund';
import GetCampaignFundDTO from '@application/CampaignFund/GetCampaignFundDTO';
import UpdateCampaignFundDTO from '@application/CampaignFund/UpdateCampaignFundDTO';
import FindCampaignFundDTO from '@application/CampaignFund/FindCampaignFundDTO';
import RemoveCampaignFundDTO from '@application/CampaignFund/RemoveCampaignFundDTO';
import GetReportDTO from '@application/CampaignFund/GetReportDTO';
import GetCampaignInvestmentsDTO from '@application/CampaignFund/GetCampaignInvestmentsDTO';
import GetCampaignInvestmentsReportDTO from './GetCampaignInvestmentsReportDTO';
import InvestorCampaignInvestmentDTO from './InvestorCampaignInvestmentDTO';
import investorInvestmentOnCampaignsWithPaginationDTO from './InvestorInvestmentOnCampaignsWithPaginationDTO';
import InvestorInvestmentOnCampaignsWithOutPaginationDTO from './InvestorInvestmentOnCampaignWithOutPaginationDTO';
import GetCampaignFundToExportDTO from './GetCampaignFundToExportDTO';
import GetAllCampaignsReportDTO from './GetAllCampaignsReportDTO';
import UpdateInvestmentStatusDTO from './UpdateInvestmentStatusDTO';

export const ICampaignFundServiceId = Symbol.for('ICampaignFundService');

type response = {
  status: string;
  paginationInfo;
  data: Array<CampaignFund>;
};

export interface ICampaignFundService {
  renewAccreditation(email: string, investor: Investor): Promise<void>;
  getCampaignFund(getCampaignFundDTO: GetCampaignFundDTO): Promise<response>;
  updateCampaignFund(updateCampaignFundDTO: UpdateCampaignFundDTO): Promise<boolean>;
  findCampaignFund(findCampaignFundDTO: FindCampaignFundDTO): Promise<CampaignFund>;
  removeCampaignFund(removeCampaignFundDTO: RemoveCampaignFundDTO): Promise<boolean>;
  getAllCampaignFundsByCampaign(campaignId: string): Promise<Array<CampaignFund>>;
  getReport(getReportDTO: GetReportDTO): Promise<any>;
  getCampaignInvestments(
    getCampaignInvestmentsDTO: GetCampaignInvestmentsDTO,
  ): Promise<response>;
  getCampaignInvestmentsReport(
    getCampaignInvestmentsDTO: GetCampaignInvestmentsReportDTO,
  ): Promise<response>;
  sendRefundFollowUpEmail(
    chargeId: string,
    isRefundRequested: boolean,
    isRefunded: boolean,
  ): Promise<boolean>;
  fetchInvestorCampaignInvestment(input: InvestorCampaignInvestmentDTO): Promise<any>;
  fetchInvestorInvestmentOnCampaignsWithPagination(
    input: investorInvestmentOnCampaignsWithPaginationDTO,
  ): Promise<any>;
  fetchInvestorInvestmentOnCampaignsWithOutPagination(
    input: InvestorInvestmentOnCampaignsWithOutPaginationDTO,
  ): Promise<any>;
  getCampaignFundToExport(input: GetCampaignFundToExportDTO): Promise<any>;
  chargeInvestor(
    email: string,
    tradeId: string,
    campaignId: string,
    amount: number,
  ): Promise<any>;
  getMultipleCampaignsReport(
    getAllCampaignsReport: GetAllCampaignsReportDTO,
  ): Promise<any>;
  getAccumulatedCampaignInvestmentReport(
    getAllCampaignsReport: GetAllCampaignsReportDTO,
  ): Promise<any>;
  updateInvestmentStatus(input: UpdateInvestmentStatusDTO): Promise<any>;
}
