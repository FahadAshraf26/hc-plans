import uuid from 'uuid/v4';
import BaseEntity from '../BaseEntity/BaseEntity';

class CampaignInfo extends BaseEntity {
  private campaignInfoId: string;
  financialHistory: any;
  private competitors: string;
  private campaignId: string;
  milestones: any;
  private investorPitch: string;
  private risks: string;
  private target: string;
  private isShowPitch: boolean;
  private investorPitchTitle: string;

  constructor(
    campaignInfoId: string,
    financialHistory: any,
    competitors: string,
    campaignId: string,
    milestones: any,
    investorPitch: string,
    risks: string,
    target: string,
    isShowPitch: boolean,
    investorPitchTitle: string,
  ) {
    super();
    this.campaignInfoId = campaignInfoId;
    this.financialHistory = financialHistory;
    this.competitors = competitors;
    this.campaignId = campaignId;
    this.milestones = milestones;
    this.investorPitch = investorPitch;
    this.risks = risks;
    this.target = target;
    this.isShowPitch = isShowPitch;
    this.investorPitchTitle = investorPitchTitle;
  }

  setInvestorPitch(investorPitch: string) {
    this.investorPitch = investorPitch;
  }

  setInvestorPitchTitle(investorPitchTitle: string) {
    this.investorPitchTitle = investorPitchTitle;
  }

  /**
   *
   * @param {object} campaignInfoObj
   * @returns CampaignInfo
   */
  static createFromObject(campaignInfoObj): CampaignInfo {
    const campaignInfo = new CampaignInfo(
      campaignInfoObj.campaignInfoId,
      campaignInfoObj.financialHistory,
      campaignInfoObj.competitors,
      campaignInfoObj.campaignId,
      campaignInfoObj.milestones,
      campaignInfoObj.investorPitch,
      campaignInfoObj.risks,
      campaignInfoObj.target,
      campaignInfoObj.isShowPitch,
      campaignInfoObj.investorPitchTitle,
    );

    if (campaignInfoObj.createdAt) {
      campaignInfo.setCreatedAt(campaignInfoObj.createdAt);
    }
    if (campaignInfoObj.updatedAt) {
      campaignInfo.setUpdatedAt(campaignInfoObj.updatedAt);
    }

    if (campaignInfoObj.deletedAt) {
      campaignInfo.setDeletedAT(campaignInfoObj.deletedAt);
    }

    return campaignInfo;
  }

  /**
   *
   * @param {string} financialHistory
   * @param {string} competitors
   * @param {string} campaignId
   * @param {string} milestones
   * @param {string} investorPitch
   * @param {object} target
   * @param risks
   * @returns CampaignInfo
   */
  static createFromDetail(
    financialHistory,
    competitors,
    campaignId,
    milestones,
    investorPitch,
    risks,
    target,
    isShowPitch = false,
    investorPitchTitle = 'Investor Pitch',
  ): CampaignInfo {
    return new CampaignInfo(
      uuid(),
      financialHistory,
      competitors,
      campaignId,
      milestones,
      investorPitch,
      risks,
      target,
      isShowPitch,
      investorPitchTitle,
    );
  }
}

export default CampaignInfo;
