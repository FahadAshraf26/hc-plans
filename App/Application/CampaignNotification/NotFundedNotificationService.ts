import { inject, injectable } from 'inversify';
import {
  IChargeRepository,
  IChargeRepositoryId,
} from '@domain/Core/Charge/IChargeRepository';
import {
  IFavoriteCampaignRepository,
  IFavoriteCampaignRepositoryId,
} from '@domain/Core/FavoriteCampaign/IFavoriteCampaignRepository';
import Campaign from '@domain/Core/Campaign/Campaign';
@injectable()
class NotFundedNotificationService {
  constructor(
    private campaign: Campaign,
    @inject(IChargeRepositoryId) private chargeRepository?: IChargeRepository,
    @inject(IFavoriteCampaignRepositoryId)
    private favoriteCampaignRepository?: IFavoriteCampaignRepository,
  ) {
    this.campaign = campaign;
  }

  async execute() {
    await this.chargeRepository.refundCampaignCharges(this.campaign.campaignId);
    await this.favoriteCampaignRepository.remoevFavoritesByCampaign(
      this.campaign.campaignId,
    );
    // await
    // remove from favorites
  }
}

export default NotFundedNotificationService;
