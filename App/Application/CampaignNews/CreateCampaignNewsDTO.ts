import CampaignNews from '@domain/Core/CampaignNews/CampaignNews';
import CampaignNewsMedia from '@domain/Core/CampaignNewsMedia/CampaignNewsMedia';

class CreateCampaignNewsDTO {
  private news: any;

  constructor(
    campaignId: string,
    title: string,
    description: string,
    hyperLink: string,
    hyperLinkText: string,
  ) {
    this.news = CampaignNews.createFromDetail(
      campaignId,
      title,
      description,
      hyperLink,
      hyperLinkText,
    );
  }

  getCampaignNews() {
    return this.news;
  }

  getCampaignId() {
    return this.news.campaignId;
  }

  setMedia(mediaObj) {
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

export default CreateCampaignNewsDTO;
