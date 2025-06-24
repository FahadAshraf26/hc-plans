import {
  ICampaignFundRepository,
  ICampaignFundRepositoryId,
} from '@domain/Core/CampaignFunds/ICampaignFundRepository';
import {
  ICampaignQARepository,
  ICampaignQARepositoryId,
} from '@domain/Core/CampaignQA/ICampaignQARepository';
import {
  IFavoriteCampaignRepository,
  IFavoriteCampaignRepositoryId,
} from '@domain/Core/FavoriteCampaign/IFavoriteCampaignRepository';
import {
  IInvestorPaymentsRepository,
  IInvestorPaymentsRepositoryId,
} from '@domain/Core/InvestorPayments/IInvestorPaymentsRepository';
import {
  IRepaymentsUpdateRepository,
  IRepaymentsUpdateRepositoryId,
} from '@domain/Core/RepaymentsUpdate/IRepaymentsUpdateRepository';
import { IUserRepository, IUserRepositoryId } from '@domain/Core/User/IUserRepository';
import { InvestorInvestmentType } from '@domain/Core/ValueObjects/InvestorInvestmentType';
import UserPortfolioService from '@domain/Services/UserPortfolioService';
import UserTypeService from '@domain/Services/UserTypeService';
import HttpException from '@infrastructure/Errors/HttpException';
import { inject, injectable } from 'inversify';
import { IUserService, IUserServiceId } from '../IUserService';
import UserRemainingInvestmentLimitDTO from '../UserRemainingInvestmentLimitDTO';
import GetUserInfoDTO from './GetUserInfoDTO';

@injectable()
class GetUserInfoUseCase {
  constructor(
    @inject(IUserRepositoryId) private userRepository: IUserRepository,
    @inject(ICampaignFundRepositoryId)
    private campaignFundRepository: ICampaignFundRepository,
    @inject(IFavoriteCampaignRepositoryId)
    private favoriteCampaignRepository: IFavoriteCampaignRepository,
    @inject(ICampaignQARepositoryId) private campaignQARepository: ICampaignQARepository,
    @inject(IInvestorPaymentsRepositoryId)
    private investorPaymentRepository: IInvestorPaymentsRepository,
    @inject(IRepaymentsUpdateRepositoryId)
    private repaymentsUpdateRepository: IRepaymentsUpdateRepository,
    @inject(IUserServiceId) private userService: IUserService,
  ) {}

  async execute(getUserInfoDTO: GetUserInfoDTO) {
    const user: any = await this.userRepository.fetchUserInfoById(
      getUserInfoDTO.getUserId(),
      getUserInfoDTO.shouldShowTrashed(),
    );
    if (!user) {
      throw new HttpException(404, 'No User record exists against provided input');
    }
    let userInvestments = 0;
    if (user.investor) {
      const { investorId } = user.investor;
      userInvestments = await this.campaignFundRepository.fetchInvestorSum(investorId);
      const limitInput = new UserRemainingInvestmentLimitDTO(user.userId);
      const [
        investments,
        otherRegCFInvestments,
        portfolioData,
        lastUpdate,
        investmentLimit,
        jobsSupported,
      ] = await Promise.all([
        this.campaignFundRepository.getInvestorPortfolioInvestments(investorId),
        this.campaignFundRepository.fetchInvestorSum(
          investorId,
          InvestorInvestmentType.REG_CF,
        ),
        this.investorPaymentRepository.fetchPortfolioData(investorId),
        this.repaymentsUpdateRepository.fetchLastUpdateDate(),
        this.userService.getUserRemainingInvestmentLimit(limitInput),
        this.campaignFundRepository.getJobSupported(investorId),
      ]);

      const totalJobSupported = jobsSupported.reduce((count, currentCount) => {
        return count + currentCount.employeeCount;
      }, 0);

      const totalBusinesses = jobsSupported[0].totalBusinesses;

      const portfolioService = UserPortfolioService.createFromDetails(
        investments,
        portfolioData,
        lastUpdate,
        investmentLimit,
        totalJobSupported,
        totalBusinesses,
      );

      user.otherRegCFInvestments = otherRegCFInvestments;
      const [userLikedCampaignsCount, userQuestionsCount] = await Promise.all([
        this.favoriteCampaignRepository.fetchLikesCountByInvestor(
          user.investor.investorId,
        ),
        this.campaignQARepository.fetchQACountByInvestor(user.userId),
      ]);
      user.userLikedCampaignsCount = userLikedCampaignsCount;
      user.userQuestionsCount = userQuestionsCount;

      user.portfolio = portfolioService.getInvestorPortfolio();
      user.investor.investorBanks.forEach((paymentOption) => {
        if (paymentOption.isCard()) {
          const card = paymentOption.getCard();
          user.card = {
            cardName: card.getCardName(),
            cardNumber: card.getLastFour(),
            cardConnectedDate: card._props.createdAt,
            investmentTypeCard: 'Card',
          };
        } else {
          const bank = paymentOption.getBank();
          user.bank = {
            accountName: bank.getAccountName(),
            accountNumber: bank.getLastFour(),
            bankConnectedDate: bank._props.createdAt,
            investmentTypeBank: 'Bank',
            dwollaFundingSourceId: bank.getDwollaFundingSourceId(),
          };
        }
      });
      delete user.investor.investorBanks;
    }
    if (user.owner) {
      user.owner.issuers = user.owner.issuers.map((issuer) => {
        return {
          issuerId: issuer.issuerId,
          issuerName: issuer.issuerName,
          legalEntityType: issuer.legalEntityType,
          ownerInCampaign: issuer.campaigns.length > 0 ? 'Yes' : 'No',
          campaigns: issuer.campaigns.map((campaign) => {
            return {
              campaignId: campaign.campaignId,
              campaignName: campaign.campaignName,
              summary: campaign.summary,
              maturityDate: campaign.maturityDate,
            };
          }),
        };
      });
    }

    const userTypeObj = UserTypeService.createFromUser(user, userInvestments);
    user.userType = userTypeObj.getUserType();
    user.accreditationStatus = userTypeObj.getAccreditationStatus();

    delete user.userQuestions;
    user.investor && delete user.investor.userLikedCampaigns;
    user.investor && delete user.investor.investments;
    user.investor && delete user.investor.investorBanks;

    return user;
  }
}

export default GetUserInfoUseCase;
