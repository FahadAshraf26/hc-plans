import { InvestorPayments } from '@domain/Core/InvestorPayments/InvestorPayments';
import { FetchInvestorPaymentsDTO } from './FetchInvestorPaymentsDTO';
import { FetchInvestorCampaignPaymentsDTO } from './FetchInvestorCampaignPaymentsDTO';
import { FetchCampaignPortfolioDTO } from './FetchCampaignPortfolioDTO';

export const IInvestorPaymentsServiceId = Symbol.for('IInvestorPaymentsService');
export interface IInvestorPaymentsService {
  getInvestorPayments(
    fetchInvestorPaymentsDTO: FetchInvestorPaymentsDTO,
  ): Promise<InvestorPayments>;
  getInvestorCampaignPayments(
    fetchInvestorCampaignPaymentsDTO: FetchInvestorCampaignPaymentsDTO,
  ): Promise<InvestorPayments>;
  fetchCampaignPortfolioData(
    fetchCampaignPortfolioDTO: FetchCampaignPortfolioDTO,
  ): Promise<any>;
}
