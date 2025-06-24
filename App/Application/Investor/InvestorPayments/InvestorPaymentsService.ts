import { CampaignStage } from '@domain/Core/ValueObjects/CampaignStage';
import {
  ICampaignRepositoryId,
  ICampaignRepository,
} from '@domain/Core/Campaign/ICampaignRepository';
import { IInvestorPaymentsService } from './IInvesterPaymentsService';
import { IUserRepository, IUserRepositoryId } from '@domain/Core/User/IUserRepository';
import {
  IInvestorPaymentsRepositoryId,
  IInvestorPaymentsRepository,
} from '@domain/Core/InvestorPayments/IInvestorPaymentsRepository';
import { FetchInvestorPaymentsDTO } from './FetchInvestorPaymentsDTO';
import { FetchInvestorCampaignPaymentsDTO } from './FetchInvestorCampaignPaymentsDTO';
import { FetchCampaignPortfolioDTO } from './FetchCampaignPortfolioDTO';
import { inject, injectable } from 'inversify';
import HttpException from '@infrastructure/Errors/HttpException';

@injectable()
class InvestorPaymentsService implements IInvestorPaymentsService {
  constructor(
    @inject(IInvestorPaymentsRepositoryId)
    private investorPaymentRepository: IInvestorPaymentsRepository,
    @inject(IUserRepositoryId) private userRepository: IUserRepository,
    @inject(ICampaignRepositoryId) private campaignRepository: ICampaignRepository,
  ) {}

  async getInvestorPayments(fetchInvestorPaymentsDTO: FetchInvestorPaymentsDTO) {
    const user = await this.userRepository.fetchById(
      fetchInvestorPaymentsDTO.getUserId(),
    );

    if (!user) {
      throw new HttpException(404, 'no user found with the provided input');
    }
    const { investorId } = user.investor;
    return this.investorPaymentRepository.getInvestorPayments(investorId);
  }

  async getInvestorCampaignPayments(
    fetchInvestorCampaignPaymentsDTO: FetchInvestorCampaignPaymentsDTO,
  ) {
    const user = await this.userRepository.fetchById(
      fetchInvestorCampaignPaymentsDTO.getUserId(),
    );

    if (!user) {
      throw new HttpException(404, 'no user found with the provided input');
    }
    const { investorId } = user.investor;

    return this.investorPaymentRepository.getInvestorCampaignPayments(
      investorId,
      fetchInvestorCampaignPaymentsDTO.getCampaignId(),
    );
  }

  async fetchCampaignPortfolioData(fetchCampaignPortfolioDTO: FetchCampaignPortfolioDTO) {
    const result = await this.investorPaymentRepository.fetchInvestorCampaignPortfolio(
      fetchCampaignPortfolioDTO.getInvestorId(),
      fetchCampaignPortfolioDTO.getCampaignId(),
      fetchCampaignPortfolioDTO.getEntityId(),
    );

    let outStandingPrincipal = 0;
    let projectedReturns = 0;

    const campaign = await this.campaignRepository.fetchById(
      fetchCampaignPortfolioDTO.getCampaignId(),
      false,
    );
    if (campaign) {
      outStandingPrincipal =
        campaign.campaignStage === CampaignStage.DEFAULTED ||
        campaign.campaignStage === CampaignStage.IN_INVESTOR_VOTE
          ? 0
          : result.totalInvestedWithoutFee - result.principle;
      projectedReturns =
        campaign.campaignStage === CampaignStage.DEFAULTED ||
        campaign.campaignStage === CampaignStage.IN_INVESTOR_VOTE
          ? result.defaultProjectionResults
          : result.projectionReturns;
    }

    return {
      costBasics: result.totalInvestedWithFee,
      outStandingPrincipal,
      projectedReturns,
      investorRateOfReturn: projectedReturns / result.totalInvestedWithoutFee,
      totalRepaid: result.totalRepaid,
      principal: result.principle,
      interest: result.interest,
      applicationFee: result.applicationFee,
      totalInvestedWithoutFee: result.totalInvestedWithoutFee,
      principleForgiven: result.principleForgivenAmount,
    };
  }
}

export default InvestorPaymentsService;
