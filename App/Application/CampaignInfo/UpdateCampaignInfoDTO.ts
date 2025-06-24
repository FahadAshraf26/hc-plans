import CampaignInfo from '../../Domain/Core/CampaignInfo/CampaignInfo';

class UpdateCampaignInfoDTO {
  private info: any;

  constructor(campaignInfoObj) {
    campaignInfoObj.financialHistory = JSON.stringify(campaignInfoObj.financialHistory);
    campaignInfoObj.milestones = JSON.stringify(campaignInfoObj.milestones);
    this.info = CampaignInfo.createFromObject(campaignInfoObj);
  }

  getCampaignId() {
    return this.info.campaignId;
  }

  getCampaignInfoId() {
    return this.info.campaignInfoId;
  }

  getCampaignInfo() {
    return this.info;
  }
}

export default UpdateCampaignInfoDTO;
