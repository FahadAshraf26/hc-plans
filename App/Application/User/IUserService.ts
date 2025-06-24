import User from '@domain/Core/User/User';
import GetUserDTO from '@application/User/GetUserDTO';
import InvestorPortfolioDTO from '@application/User/InvestorPortfolioDTO';
import InvestorAccreditation from '@domain/Core/InvestorAccreditation/InvestorAccreditation';
import GetAllInvestmentsByInvestorId from './GetAllInvestmentsByInvestorIdDTO';
import GetAllInvestmentsByInvestorIdAndEntityDTO from './GetAllInvestmentsByInvestorIdAndEntityDTO';
import UserRemainingInvestmentLimitDTO from './UserRemainingInvestmentLimitDTO';
import UpdateUserLastPromptDTO from './UpdateUserLastPromptDTO';
import ExportEducationalDataDTO from './ExportEducationalData/ExportEducationalDataDTO';

export const IUserServiceId = Symbol.for('IUserService');
type response = {
  status: string;
  paginationInfo;
  data: Array<any>;
};
type investorPortfolio = {
  investmentLimit: number;
  avgInvestment: number;
  invested: number;
  successfulInvestments: number;
};

export interface IUserService {
  updateUserEmailOrPassword(dto): Promise<any>;
  updateFcmToken(dto): Promise<any>;
  updateBiometricInfo(dto): Promise<any>;
  getAllUsers(getAllUsersDTO): Promise<response>;
  getUserWithKyc(getUserWithKycDTO): Promise<response>;
  getUser(getUserDTO: GetUserDTO): Promise<any>;
  getUserInvestments(investmentsDTO): Promise<any>;
  getAllUsersInvestments(): Promise<any>;
  getAccumulatedInvestments(investmentsDTO): Promise<any>;
  getUserQA(getQADTO): Promise<response>;
  investorPortfolio(
    investorPortfolioDTO: InvestorPortfolioDTO,
  ): Promise<any>;
  investorInvestmentLimitAvailability(
    investorInvestmentLimitAvailabilityDTO,
  ): Promise<{ available: boolean; date?: Date; }>;
  getInvestorAccreditation(getInvestorAccreditation): Promise<InvestorAccreditation>;
  PersonalDetailUpdateNotifyAfterFiveDays(): Promise<boolean>;
  PersonalDetailUpdateNotifyAfterTwoWeeks(): Promise<boolean>;
  getUserFavoriteCampaign(getFavoriteCampaignDTO): Promise<response>;
  fetchByInvestorIds(investorIds): Promise<Array<User>>;
  getAllInvestorAccreditations(getAllInvestorAccreditationsDTO): Promise<response>;
  saveAcknowledgements(saveAcknowledgementsDTO): Promise<boolean>;
  getSummary(dto): Promise<any>;
  getInvestmentsByInvestorId(
    getAllInvestmentsByInvestorIdDTO: GetAllInvestmentsByInvestorId,
  ): Promise<any>;
  getInvestmentsByInvestorIdAndEntity(
    getAllInvestmentsByInvestorIdAndEntity: GetAllInvestmentsByInvestorIdAndEntityDTO,
  ): Promise<any>;
  getUserRemainingInvestmentLimit(userRemainingInvestmentLimitDTO: UserRemainingInvestmentLimitDTO): Promise<any>;
  getUserInvestmentPerAnum(userId: string): Promise<number>;
  updateUserLastPromtValue(updateUserLastPromptDTO: UpdateUserLastPromptDTO): Promise<boolean>;
  resetKycStatus(userId: string): Promise<any>;
}
