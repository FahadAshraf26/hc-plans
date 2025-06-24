import CampaignOwnerStory from '../../Core/CampaignOwnerStory/CampaignOwnerStory';
import { inject } from 'inversify';
import {
  IRedisService,
  IRedisServiceId,
} from '@infrastructure/Service/RedisService/IRedisService';
const CURRENT_CAMPAIGN_ID_KEY = `CAMPAIGN_ORDER|CURRENT_ACTIVE_CAMPAIGN_ID`;

class CampaignOwnerStoryOrderService {
  ownerStories: CampaignOwnerStory;

  constructor(
    ownerStories: CampaignOwnerStory,
    @inject(IRedisServiceId) private redisService?: IRedisService,
  ) {
    this.ownerStories = ownerStories;
  }
  /**
   * It will order the campaign owner stories if campaignId found
   */
  async setCampaignOwnerStoryOrder() {
    const currentCampaignId = await this.redisService.get(CURRENT_CAMPAIGN_ID_KEY);
    if (currentCampaignId) {
      return this.orderCampaignOwnerStories(this.ownerStories, currentCampaignId);
    }
    return this.ownerStories;
  }

  /**
   * It will order campaign owner stories according to the current campaign Id
   * @param {*} campaignOwnerStories
   * @param {*} campaignId
   */
  orderCampaignOwnerStories(campaignOwnerStories: any, campaignId: string) {
    let orderedCampaignOwnerStories: CampaignOwnerStory[] = [];
    const index = campaignOwnerStories.findIndex((ownerStory) => {
      return ownerStory.campaignId === campaignId;
    });
    if (index > -1) {
      orderedCampaignOwnerStories.push(campaignOwnerStories[index]);
      campaignOwnerStories.splice(index, 1);
    }
    return [...orderedCampaignOwnerStories, ...campaignOwnerStories];
  }

  static createFromCampaignOwnerStories(ownerStories: CampaignOwnerStory) {
    return new CampaignOwnerStoryOrderService(ownerStories);
  }
}

export default CampaignOwnerStoryOrderService;
