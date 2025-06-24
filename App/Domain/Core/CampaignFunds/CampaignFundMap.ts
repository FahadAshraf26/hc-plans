import Campaign from '@domain/Core/Campaign/Campaign';
import Charge from '@domain/Core/Charge/Charge';
import Investor from '@domain/Core/Investor/Investor';
import CampaignFund from './CampaignFund';
import InvestmentType from './InvestmentType';
import _groupBy from 'lodash.groupby';

class CampaignFundMap {
  static toDomain(campaignFundObj) {
    const investmentType = InvestmentType.createFromValue(campaignFundObj.investmentType);
    const investmentAmount = InvestmentType.createFromValue(campaignFundObj.amount);
    
    const campaignFund = CampaignFund.create(
      {
        campaignId: campaignFundObj.campaignId,
        investorId: campaignFundObj.investorId,
        chargeId: campaignFundObj.chargeId,
        investmentPaymentOptionId: campaignFundObj.investmentPaymentOptionId,
        amount: investmentAmount,
        ip: campaignFundObj.ip,
        investorAccreditationStatus: campaignFundObj.investorAccreditationStatus,
        investorAnnualIncome: campaignFundObj.investorAnnualIncome,
        investorNetWorth: campaignFundObj.investorNetWorth,
        investmentType,
        entityId: campaignFundObj.entityId,
        promotionCredits: campaignFundObj.promotionCredits,
        netAmount: campaignFundObj.netAmount,
      },
      campaignFundObj.campaignFundId,
    );

    if (campaignFundObj.charge) {
      campaignFund.setCharge(Charge.createFromObject(campaignFundObj.charge));
    }

    if (campaignFundObj.campaignInvestor) {
      campaignFund.setInvestor(
        Investor.createFromObject(campaignFundObj.campaignInvestor),
      );
    }

    if (campaignFundObj.campaign) {
      campaignFund.setCampaign(Campaign.createFromObject(campaignFundObj.campaign));
    }

    campaignFund.setTimestamps({
      createdAt: campaignFundObj.createdAt,
      updatedAt: campaignFundObj.updatedAt,
      deletedAt: campaignFundObj.deletedAt,
    });

    return campaignFund;
  }

  static toPersistence(campaignFundEntity) {
    return {
      campaignFundId: campaignFundEntity.CampaignFundId(),
      campaignId: campaignFundEntity.CampaignId(),
      investorId: campaignFundEntity.InvestorId(),
      chargeId: campaignFundEntity.ChargeId(),
      investmentPaymentOptionId: campaignFundEntity.InvestorPaymentOptionsId(),
      amount: campaignFundEntity.Amount(),
      ip: campaignFundEntity.Ip(),
      investmentType: campaignFundEntity.InvestmentType(),
      ...campaignFundEntity.InvestorStatusAtTimeOfInvestment(),
      entityId: campaignFundEntity.EntityId(),
      promotionCredits: campaignFundEntity.PromotionCredits(),
      netAmount: campaignFundEntity.NetAmount(),
    };
  }

  static toDTO(campaignFundEntity) {
    const response = {
      campaignFundId: campaignFundEntity.CampaignFundId(),
      campaignId: campaignFundEntity.CampaignId(),
      investorId: campaignFundEntity.InvestorId(),
      chargeId: campaignFundEntity.ChargeId(),
      investmentPaymentOptionId: campaignFundEntity.InvestorPaymentOptionsId(),
      amount: campaignFundEntity.Amount(),
      investmentType: campaignFundEntity.InvestmentType(),
      ip: campaignFundEntity.Ip(),
      entityId: campaignFundEntity.EntityId(),
      ...campaignFundEntity.getTimestamps(),
      ...campaignFundEntity.InvestorStatusAtTimeOfInvestment(),
      promotionCredits: campaignFundEntity.PromotionCredits(),
      netAmount: campaignFundEntity.NetAmount(),
    };

    if (campaignFundEntity.Campaign()) {
      response.campaign = campaignFundEntity.Campaign().toPublicDTO();
    }

    if (campaignFundEntity.Investor()) {
      response.investor = campaignFundEntity.Investor();
    }

    if (campaignFundEntity.Charge()) {
      response.charge = campaignFundEntity.Charge();
    }

    if (campaignFundEntity.HybridTransaction()) {
      response.hybridTransactions = campaignFundEntity.HybridTransaction();
    }
    response.includeWallet = false;
    if (campaignFundEntity.IncludeWallet()) {
      response.includeWallet = campaignFundEntity.IncludeWallet();
    }

    if (campaignFundEntity.RepeatInvestor()) {
      response.repeatInvestor = campaignFundEntity.RepeatInvestor();
    }
    return response;
  }

  static toCampaignsInvestmentReportDTO(campaignFundObj) {
    return {
      name: campaignFundObj.campaign.campaignName,
      value: campaignFundObj.amount,
      date: campaignFundObj.createdAt,
    };
  }
}

export default CampaignFundMap;
