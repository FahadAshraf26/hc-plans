import CampaignFund from '@domain/Core/CampaignFunds/CampaignFund';

export const campaignFundEntity = (
  dto,
  paymentOption,
  user,
  investmentType,
  netAmount,
) => {
  return dto.EntityId()
    ? CampaignFund.createEntityFund({
        campaignId: dto.CampaignId(),
        investorId: dto.InvestorId(),
        investorPaymentOptionsId: paymentOption
          ? paymentOption.getInvestorPaymentOptionsId()
          : null,
        amount: dto.Amount(),
        ip: dto.Ip(),
        investorAccreditationStatus: user.AccreditationStatus(),
        investorNetWorth: user.NetWorth(),
        investorAnnualIncome: user.AnnualIncome(),
        investmentType,
        entityId: dto.EntityId(),
        netAmount,
      })
    : CampaignFund.create({
        campaignId: dto.CampaignId(),
        investorId: dto.InvestorId(),
        investorPaymentOptionsId: paymentOption
          ? paymentOption.getInvestorPaymentOptionsId()
          : null,
        amount: dto.Amount(),
        ip: dto.Ip(),
        investorAccreditationStatus: user.AccreditationStatus(),
        investorNetWorth: user.NetWorth(),
        investorAnnualIncome: user.AnnualIncome(),
        investmentType,
        netAmount,
      });
};
