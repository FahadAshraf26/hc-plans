import {
  IRedisService,
} from '@infrastructure/Service/RedisService/IRedisService';

const R = require('ramda');
const { CampaignStage } = require('../../Core/ValueObjects/CampaignStage');
const CAMPAIGN_ORDER = 'CAMPAIGN_ORDER';
const CURRENT_ACTIVE_CAMPAIGN_ID_KEY = `${CAMPAIGN_ORDER}|CURRENT_ACTIVE_CAMPAIGN_ID`;
const PREVIOUS_ACTIVE_CAMPAIGN_ID_KEY = `${CAMPAIGN_ORDER}|PREVIOUS_ACTIVE_CAMPAIGN_ID`;
const CURRENT_COMING_SOON_CAMPAIGN_ID_KEY = `${CAMPAIGN_ORDER}|CURRENT_COMING_SOON_CAMPAIGN_ID`;
const PREVIOUS_COMING_SOON_CAMPAIGN_ID_KEY = `${CAMPAIGN_ORDER}|PREVIOUS_COMING_SOON_CAMPAIGN_ID`;
const CURRENT_OTHER_CAMPAIGN_ID_KEY = `${CAMPAIGN_ORDER}|CURRENT_OTHER_CAMPAIGN_ID`;
const PREVIOUS_OTHER_CAMPAIGN_ID_KEY = `${CAMPAIGN_ORDER}|PREVIOUS_OTHER_CAMPAIGN_ID`;
const CURRENT_CAMPAIGN_EXPIRY_TIME = 2 * 60 * 60; //In Seconds

class CampaignOrderService {
  campaigns: any;
  redisService: IRedisService;

  constructor(campaigns, redisService) {
    this.campaigns = campaigns;
    this.redisService = redisService;
  }

  filterCampaignsByCampaignStage = (stage) =>
    R.filter((campaign) => campaign.campaignStage === stage);
  getOtherCampaigns = R.filter(
    (campaign) =>
      campaign.campaignStage !== CampaignStage.COMING_SOON &&
      campaign.campaignStage !== CampaignStage.FUNDRAISING,
  );
  getActiveCampaigns = this.filterCampaignsByCampaignStage(CampaignStage.FUNDRAISING);
  getComingSoonCampaigns = this.filterCampaignsByCampaignStage(CampaignStage.COMING_SOON);

  /**
   * It will order the campaigns randomly
   * @param {*} campaigns
   */
  async setActiveCampaignOrder() {
    const [activeCampaigns, comingSoonCampaigns] = await Promise.all([
      this.orderCampaignsByStage(CampaignStage.FUNDRAISING),
      this.orderCampaignsByStage(CampaignStage.COMING_SOON),
    ]);

    return [
      ...activeCampaigns,
      ...comingSoonCampaigns,
      ...this.getOtherCampaigns(this.campaigns),
    ];
  }

  async orderCampaignsByStage(stage) {
    switch (stage) {
      case CampaignStage.FUNDRAISING:
        const activeCampaigns = this.getActiveCampaigns(this.campaigns);
        return this.orderCampaigns(
          activeCampaigns,
          CURRENT_ACTIVE_CAMPAIGN_ID_KEY,
          PREVIOUS_ACTIVE_CAMPAIGN_ID_KEY,
        );
      case CampaignStage.COMING_SOON:
        const comingSoonCampaigns = this.getComingSoonCampaigns(this.campaigns);
        return this.orderCampaigns(
          comingSoonCampaigns,
          CURRENT_COMING_SOON_CAMPAIGN_ID_KEY,
          PREVIOUS_COMING_SOON_CAMPAIGN_ID_KEY,
        );
      default:
        const otherCampaigns = this.getOtherCampaigns(this.campaigns);
        return this.orderCampaigns(
          otherCampaigns,
          CURRENT_OTHER_CAMPAIGN_ID_KEY,
          PREVIOUS_OTHER_CAMPAIGN_ID_KEY,
        );
    }
  }

  async orderCampaigns(filteredCampaigns, currentKey, previousKey) {
    if (filteredCampaigns.length <= 1) {
      return filteredCampaigns;
    }

    const nextCampaignId = await this.getNextCampaignId(
      filteredCampaigns,
      currentKey,
      previousKey,
    );
    return this.moveCurrentCampaignToTop(filteredCampaigns, nextCampaignId);
  }

  async getNextCampaignId(campaigns, currentKey, previousKey) {
    const currentId = await this.redisService.get(currentKey);

    if (currentId) return currentId;

    const previousId = await this.redisService.get(previousKey);
    const nextCampaignId = this.getRandomCampaign(previousId, campaigns);

    await this.redisService.set(previousKey, nextCampaignId);
    await this.redisService.set(
      currentKey,
      nextCampaignId,
      true,
      CURRENT_CAMPAIGN_EXPIRY_TIME,
    );

    return nextCampaignId;
  }

  getRandomCampaign(previousCampaignId, campaigns) {
    let index;
    let currentCampaignId;
    do {
      index = Math.floor(Math.random() * campaigns.length);
      currentCampaignId = campaigns[index].campaignId;
    } while (previousCampaignId === currentCampaignId);
    return currentCampaignId;
  }

  /**
   * It will keep the finded index campaign on first number
   * @param {*} campaigns
   * @param {*} campaignId
   */
  moveCurrentCampaignToTop(campaigns, campaignId) {
    let orderedCampaigns = [];
    const index = campaigns.findIndex((campaign) => {
      return campaign.campaignId === campaignId;
    });
    if (index > -1) {
      orderedCampaigns.push(campaigns[index]);
      campaigns.splice(index, 1);
    }
    return [...orderedCampaigns, ...campaigns];
  }

  static createFromCampaigns(campaigns, redisService) {
    return new CampaignOrderService(campaigns, redisService);
  }
}

export default CampaignOrderService;
