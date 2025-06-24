import { FetchCampaignPortfolioDTO } from './../../Application/Investor/InvestorPayments/FetchCampaignPortfolioDTO';
import {
  IInvestorPaymentsService,
  IInvestorPaymentsServiceId,
} from '@application/Investor/InvestorPayments/IInvesterPaymentsService';
import { FetchInvestorPaymentsDTO } from '@application/Investor/InvestorPayments/FetchInvestorPaymentsDTO';
import { FetchInvestorCampaignPaymentsDTO } from '@application/Investor/InvestorPayments/FetchInvestorCampaignPaymentsDTO';
import { inject, injectable } from 'inversify';

@injectable()
class InvestorPaymentsController {
  constructor(
    @inject(IInvestorPaymentsServiceId)
    private investorPaymentsService: IInvestorPaymentsService,
  ) {}

  getInvestorPayments = async (httpRequest) => {
    const { userId } = httpRequest.decoded;

    const input = new FetchInvestorPaymentsDTO(userId);
    const result = await this.investorPaymentsService.getInvestorPayments(input);

    return {
      body: {
        status: 'success',
        data: result,
      },
    };
  };

  getInvestorCampaignPayments = async (httpRequest) => {
    const { userId } = httpRequest.decoded;
    const { campaignId } = httpRequest.params;

    const input = new FetchInvestorCampaignPaymentsDTO(userId, campaignId);
    const result = await this.investorPaymentsService.getInvestorCampaignPayments(input);

    return {
      body: {
        status: 'success',
        data: result,
      },
    };
  };

  getCampaignPortfolio = async (httpRequest) => {
    const { campaignId } = httpRequest.query;
    const { investorId } = httpRequest.params;

    const input = new FetchCampaignPortfolioDTO(investorId, campaignId);
    const result = await this.investorPaymentsService.fetchCampaignPortfolioData(input);
    return {
      body: {
        status: 'success',
        data: result,
      },
    };
  };

  getEntityCampaignPortfolio = async (httpRequest) => {
    const { campaignId } = httpRequest.query;
    const { investorId,entityId } = httpRequest.params;

    const input = new FetchCampaignPortfolioDTO(investorId, campaignId,entityId);
    const result = await this.investorPaymentsService.fetchCampaignPortfolioData(input);
    return {
      body: {
        status: 'success',
        data: result,
      },
    };
  };
}

export default InvestorPaymentsController;
