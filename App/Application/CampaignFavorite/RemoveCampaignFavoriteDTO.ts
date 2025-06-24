class RemoveFavoriteCampaignDTO {
  private favoritecampaignId: string;
  private hardDelete: string;

  constructor(favoritecampaignId: string, hardDelete: string) {
    this.favoritecampaignId = favoritecampaignId;
    this.hardDelete = hardDelete;
  }

  getFavoriteCampaignId(): string {
    return this.favoritecampaignId;
  }

  shouldHardDelete(): boolean {
    return this.hardDelete === 'true';
  }
}

export default RemoveFavoriteCampaignDTO;
