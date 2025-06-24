import CampaignNews from '../../Domain/Core/CampaignNews/CampaignNews';
import CampaignNewsMedia from '../../Domain/Core/CampaignNewsMedia/CampaignNewsMedia';

class UpdateCampaignNewsDTO {
  private news: any;

  constructor(campaignNewsObj) {
    this.news = CampaignNews.createFromObject(campaignNewsObj);
  }

  getCampaignNews() {
    return this.news;
  }

  getCampaignNewsId() {
    return this.news.campaignNewsId;
  }

  setMedia(mediaObj) {
    if (mediaObj.campaignNewsMediaId) {
      const media = CampaignNewsMedia.createFromObject(mediaObj);
      this.news.setMedia(media);
      return;
    }
    if (!mediaObj.campaignNewsId) {
      mediaObj.campaignNewsId = this.news.campaignNewsId;
    }

    const { campaignNewsId, path, mimetype: mimeType, originalPath } = mediaObj;
    const media = CampaignNewsMedia.createFromDetail(
      campaignNewsId,
      path,
      mimeType,
      originalPath,
    );
    this.news.setMedia(media);
  }
}

export default UpdateCampaignNewsDTO;
