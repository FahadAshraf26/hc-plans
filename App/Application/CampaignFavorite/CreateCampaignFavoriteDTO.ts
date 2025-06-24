import FavoriteCampaign from '../../Domain/Core/FavoriteCampaign/FavoriteCampaign';

class CreateCampaignFavoriteDTO {
  private favoriteCampaign: FavoriteCampaign;

  constructor(campaignId: string, investorId: string) {
    this.favoriteCampaign = FavoriteCampaign.createFromDetail(campaignId, investorId);
  }

  getFavoriteCampaign(): FavoriteCampaign {
    return this.favoriteCampaign;
  }
}

export default CreateCampaignFavoriteDTO;
