import uuid from 'uuid/v4';
import Investor from '../Investor/Investor';
import Campaign from '../Campaign/Campaign';

class FavoriteCampaign {
  favoriteCampaignId: string;
  campaignId: string;
  investorId: string;
  createdAt!: Date;
  updatedAt!: Date;
  deletedAt!: Date;
  investor!: Investor;
  campaign!: Campaign;

  constructor(favoriteCampaignId: string, campaignId: string, investorId: string) {
    this.favoriteCampaignId = favoriteCampaignId;
    this.campaignId = campaignId;
    this.investorId = investorId;
  }

  /**
   * Set Created Date
   * @param {Date} createdAt
   */
  setCreatedAt(createdAt: Date) {
    this.createdAt = createdAt;
  }

  /**
   * Set Updated Date
   * @param {Date} updatedAt
   */
  setUpdatedAt(updatedAt: Date) {
    this.updatedAt = updatedAt;
  }

  /**
   * Set Deleted Date
   * @param {Date} deletedAt
   */
  setDeletedAT(deletedAt: Date) {
    this.deletedAt = deletedAt;
  }

  /**
   * Set Interested Investor
   * @param {Investor} investor
   */
  setInterestedInvestor(investor: Investor) {
    this.investor = investor;
  }

  /**
   * Set Campaign
   * @param {Campaign} campaign
   */
  setCampaign(campaign: Campaign) {
    this.campaign = campaign;
  }

  /**
   * Create FavoriteCampaign Object
   * @param {object} favoriteCampaignObj
   * @returns FavoriteCampaign
   */
  static createFromObject(favoriteCampaignObj) {
    const favoriteCampaign = new FavoriteCampaign(
      favoriteCampaignObj.favoriteCampaignId,
      favoriteCampaignObj.campaignId,
      favoriteCampaignObj.investorId,
    );

    if (favoriteCampaignObj.investor) {
      favoriteCampaign.setInterestedInvestor(
        Investor.createFromObject(favoriteCampaignObj.investor),
      );
    }

    if (favoriteCampaignObj.createdAt) {
      favoriteCampaign.setCreatedAt(favoriteCampaignObj.createdAt);
    }

    if (favoriteCampaignObj.updatedAt) {
      favoriteCampaign.setUpdatedAt(favoriteCampaignObj.updatedAt);
    }

    if (favoriteCampaignObj.deletedAt) {
      favoriteCampaign.setDeletedAT(favoriteCampaignObj.deletedAt);
    }
    if(favoriteCampaignObj.campaign) {
      favoriteCampaign.setCampaign(
        Campaign.createFromObject(favoriteCampaignObj.campaign),
      );
    }
    return favoriteCampaign;
  }

  /**
   * Create FavoriteCampaign Object with Id
   * @param {string} campaignId
   * @param {string} investorId
   * @returns FavoriteCampaign
   */
  static createFromDetail(campaignId: string, investorId: string) {
    return new FavoriteCampaign(uuid(), campaignId, investorId);
  }
}

export default FavoriteCampaign;
