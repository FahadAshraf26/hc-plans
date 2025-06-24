import { campaignFundEntity } from './../../../Application/CampaignFund/createCampaignFund/Utils/CampaignFundEntity';
import { ProjectionReturns } from './../ProjectionReturns/ProjectionReturns';
import uuid from 'uuid/v4';
import BaseEntity from '@domain/Core/BaseEntity/BaseEntity';

export class InvestorPayments extends BaseEntity {
  private investorPaymentsId: string;
  private prorate: number;
  private investorPaymentsProjections: Array<ProjectionReturns>;
  private campaignName: string;
  private campaignStage: string;

  constructor(investorPaymentsId: string, prorate: number) {
    super();
    this.investorPaymentsId = investorPaymentsId;
    this.prorate = prorate;
  }

  static createFromObject(investorPaymentsObj) {
    const investorPayment = new InvestorPayments(
      investorPaymentsObj.investorPaymentsId,
      investorPaymentsObj.prorate,
    );
    if (investorPaymentsObj.createdAt) {
      investorPayment.setCreatedAt(investorPaymentsObj.createdAt);
    }
    if (investorPaymentsObj.updatedAt) {
      investorPayment.setUpdatedAt(investorPaymentsObj.updatedAt);
    }
    if (investorPaymentsObj.deletedAt) {
      investorPayment.setDeletedAT(investorPaymentsObj.deletedAt);
    }

    return investorPayment;
  }

  setInvestorPaymentsProjections(investorPaymentsProjections: Array<ProjectionReturns>) {
    this.investorPaymentsProjections = investorPaymentsProjections;
  }

  setCampaign(campaignName: string) {
    this.campaignName = campaignName;
  }

  setCampaignStage(campaignStage: string) {
    this.campaignStage = campaignStage;
  }

  getInvestorPaymentsProjections() {
    return this.investorPaymentsProjections;
  }

  static createFromDetail(prorate) {
    return new InvestorPayments(uuid(), prorate);
  }
}
