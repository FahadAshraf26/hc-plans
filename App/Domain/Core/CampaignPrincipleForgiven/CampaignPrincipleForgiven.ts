import uuid from 'uuid/v4';
import BaseEntity from '@domain/Core/BaseEntity/BaseEntity';

class CampaignPrincipleForgiven extends BaseEntity {
  private campaignPrincipleForgivenId: string;
  private principleForgivenAmount: number;
  private campaignId: string;
  private investorId: string;

  constructor({ campaignPrincipleForgivenId, principleForgivenAmount }) {
    super();
    this.campaignPrincipleForgivenId = campaignPrincipleForgivenId;
    this.principleForgivenAmount = principleForgivenAmount;
  }

  getCampaignPrincipleForgivenId() {
    return this.campaignPrincipleForgivenId;
  }

  getPrincipleForgivenAmount() {
    return this.principleForgivenAmount;
  }

  setCampaignId(campaignId: string) {
    this.campaignId = campaignId;
  }

  getCampaignId() {
    return this.campaignId;
  }

  setInvestorId(investorId: string) {
    this.investorId = investorId;
  }

  getInvestorId() {
    return this.investorId;
  }

  static createFromObject(campaignPrincipleForgivenObj) {
    const campaignPrincipleForgiven = new CampaignPrincipleForgiven(
      campaignPrincipleForgivenObj,
    );

    if (campaignPrincipleForgivenObj.createdAt) {
      campaignPrincipleForgiven.setCreatedAt(campaignPrincipleForgivenObj.createdAt);
    }

    if (campaignPrincipleForgivenObj.updatedAt) {
      campaignPrincipleForgiven.setUpdatedAt(campaignPrincipleForgivenObj.updatedAt);
    }

    if (campaignPrincipleForgivenObj.deletedAt) {
      campaignPrincipleForgiven.setDeletedAT(campaignPrincipleForgivenObj.deletedAt);
    }

    if (campaignPrincipleForgivenObj.campaignId) {
      campaignPrincipleForgiven.setCampaignId(campaignPrincipleForgivenObj.campaignId);
    }

    if (campaignPrincipleForgivenObj.investorId) { 
      campaignPrincipleForgiven.setInvestorId(campaignPrincipleForgivenObj.investorId);
    }

    return campaignPrincipleForgiven;
  }

  static createFromDetail(campaignPrincipleForgivenProps): CampaignPrincipleForgiven {
    return new CampaignPrincipleForgiven({
      campaignPrincipleForgivenId: uuid(),
      ...campaignPrincipleForgivenProps,
    });
  }
}

export default CampaignPrincipleForgiven;
