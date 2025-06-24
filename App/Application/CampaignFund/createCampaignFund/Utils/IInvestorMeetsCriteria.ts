export const IInvestorMeetsCriteriaId = Symbol.for('IInvestorMeetsCriteria')
export interface IInvestorMeetsCriteria{ 
  getAmountInvestedByInvestorInLastTwelveMonths(investorId): Promise<any>;
  validateInvestorMeetsCriteria(dto, campaignFundService): Promise<any>;
}