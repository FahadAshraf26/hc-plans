import Campaign from '@domain/Core/Campaign/Campaign';
import CampaignTag from '../../../Domain/Core/CampaignTag/CampaignTag';
import FavoriteCampaign from '../../../Domain/Core/FavoriteCampaign/FavoriteCampaign';
import CampaignMedia from '@domain/Core/CamapignMedia/CampaignMedia';

class CreateCampaignDTO {
  private campaign: any;
  private issuerId: string;
  private ip: string;
  private signImage: any;

  constructor(campaignProps, issuerId, ip, file) {
    this.campaign = Campaign.createFromDetail({ issuerId, ...campaignProps });
    this.issuerId = issuerId;
    this.ip = ip;
    this.signImage = file;
  }

  Ip() {
    return this.ip;
  }
  getCampaign() {
    return this.campaign;
  }

  getIssuerId() {
    return this.issuerId;
  }

  setCampaignTag(campaignTagObj) {
    if (!campaignTagObj.campaignId) {
      campaignTagObj.campaignId = this.campaign.campaignId;
    }

    const { campaignId, tagId } = campaignTagObj;
    const campaignTag = CampaignTag.createFromDetail(campaignId, tagId);
    this.campaign.setTag(campaignTag);
  }

  setCampaignInterestedInvestor(campaignInterestedInvestorObj) {
    if (!campaignInterestedInvestorObj.campaignId) {
      campaignInterestedInvestorObj.campaignId = this.campaign.campaignId;
    }

    const { campaignId, investorId } = campaignInterestedInvestorObj;
    const campaignInterestedInvestor = FavoriteCampaign.createFromDetail(
      campaignId,
      investorId,
    );
    this.campaign.setInterestedInvestor(campaignInterestedInvestor);
  }

  setMedia(mediaObj) {
    if (!mediaObj.campaignId) {
      mediaObj.campaignId = this.campaign.campaignId;
    }

    const { campaignId, path, mimetype: mimeType } = mediaObj;
    const media = CampaignMedia.createFromDetail(campaignId, path, mimeType);
    this.campaign.setMedia(media);
  }

  getSignImage() {
    return this.signImage;
  }
}

export default CreateCampaignDTO;
