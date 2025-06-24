import CampaignInfo from '@domain/Core/CampaignInfo/CampaignInfo';

class CreateCampaignInfoDTO {
  private info: any;

  constructor(
    campaignId,
    financialHistory,
    competitors,
    milestones,
    investorPitch,
    risks,
    target,
    isShowPitch = false,
    investorPitchTitle = 'Investor Pitch',
  ) {
    this.info = CampaignInfo.createFromDetail(
      JSON.stringify(financialHistory),
      competitors,
      campaignId,
      JSON.stringify(milestones),
      investorPitch,
      risks,
      target,
      isShowPitch,
      investorPitchTitle,
    );
  }

  getCampaignId() {
    return this.info.campaignId;
  }

  getCampaignInfo() {
    return this.info;
  }
}

export default CreateCampaignInfoDTO;
