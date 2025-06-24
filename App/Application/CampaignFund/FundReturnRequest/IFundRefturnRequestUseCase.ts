import FundReturnRequestDTO from '@application/CampaignFund/FundReturnRequest/FundReturnRequestDTO';
import Campaign from '@domain/Core/Campaign/Campaign';
import CampaignFund from '@domain/Core/CampaignFunds/CampaignFund';
import User from '@domain/Core/User/User';
import InvestorPaymentOptions from '@domain/InvestorPaymentOptions/InvestorPaymentOptions';

export const IFundReturnRequestUseCaseId = Symbol.for("IFundReturnRequestUseCase");

export interface IFundReturnRequestUseCase{
    fetchCampaignFund(campaignFundId:string):Promise<CampaignFund>;
    fetchCampaign(campaignId: string): Promise<Campaign>
    fetchInvestorBank(investorId: string): Promise<InvestorPaymentOptions>
    fetchInvestor(investorId: string): Promise<User>
    execute(fundReturnRequestDTO:FundReturnRequestDTO):Promise<boolean>;
}
