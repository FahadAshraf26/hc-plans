import Campaign from '@domain/Core/Campaign/Campaign';
import CampaignTag from '@domain/Core/CampaignTag/CampaignTag';
import CampaignMedia from '@domain/Core/CamapignMedia/CampaignMedia';
import FavoriteCampaign from '@domain/Core/FavoriteCampaign/FavoriteCampaign';

class UpdateCampaignDTO {
  campaign: any;
  ip: string;
  private signImage: any;

  constructor(campaignObj, ip, file) {
    this.campaign = Campaign.createFromObject(campaignObj);
    this.ip = ip;
    this.signImage = file;
  }

  getIp() {
    return this.ip;
  }

  getCampaign() {
    return this.campaign;
  }

  getCampaignId() {
    return this.campaign.campaignId;
  }

  setCampaignTag(campaignTagObj) {
    if (!campaignTagObj.campaignId) {
      campaignTagObj.campaignId = this.campaign.campaignId;
    }

    if (campaignTagObj.campaignTagId) {
      const campaignTag = CampaignTag.createFromObject(campaignTagObj);
      this.campaign.setTag(campaignTag);
      return;
    }

    const { campaignId, tagId } = campaignTagObj;
    const campaignTag = CampaignTag.createFromDetail(campaignId, tagId);
    this.campaign.setTag(campaignTag);
  }

  setCampaignInterestedInvestor(campaignInterestedInvestorObj) {
    if (!campaignInterestedInvestorObj.campaignId) {
      campaignInterestedInvestorObj.campaignId = this.campaign.campaignId;
    }

    if (campaignInterestedInvestorObj.favoriteCampaignId) {
      const campaignInterestedInvestor = FavoriteCampaign.createFromObject(
        campaignInterestedInvestorObj,
      );
      this.campaign.setInterestedInvestor(campaignInterestedInvestor);
      return;
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

    if (mediaObj.campaignMediaId) {
      const media = CampaignMedia.createFromObject(mediaObj);
      this.campaign.setMedia(media);
      return;
    }

    const { campaignNewsId, path, mimeType } = mediaObj;
    const media = CampaignMedia.createFromDetail(campaignNewsId, path, mimeType);
    this.campaign.setMedia(media);
  }

  getSignImage() {
    return this.signImage;
  }
}

export default UpdateCampaignDTO;
