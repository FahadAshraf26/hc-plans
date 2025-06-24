class FindCampaignFavoriteDTO {
  private favoriteCampaignId: string;

  constructor(favoriteCampaignId: string) {
    this.favoriteCampaignId = favoriteCampaignId;
  }

  getCampaignFavoriteId(): string {
    return this.favoriteCampaignId;
  }
}

export default FindCampaignFavoriteDTO;
