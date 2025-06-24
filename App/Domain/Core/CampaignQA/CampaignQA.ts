import uuid from 'uuid/v4';
import User from '../User/User';
import Campaign from '../Campaign/Campaign';
import BaseEntity from '../BaseEntity/BaseEntity';

class CampaignQA extends BaseEntity {
  campaignQAId: string;
  campaignId: string;
  userId: string;
  private parentId: string;
  private type: string;
  private text: string;
  private children: CampaignQA[];
  private user!: User;
  private campaign!: Campaign;
  private parent!: CampaignQA;

  constructor(
    campaignQAId: string,
    campaignId: string,
    userId: string,
    parentId: string,
    type: string,
    text: string,
  ) {
    super();
    this.campaignQAId = campaignQAId;
    this.campaignId = campaignId;
    this.userId = userId;
    this.parentId = parentId;
    this.type = type;
    this.text = text;
    this.children = [];
  }

  setUser(user: User) {
    this.user = user;
  }

  /**
   *
   * @param {Campaign} campaign
   */
  setCampaign(campaign: Campaign) {
    this.campaign = campaign;
  }

  /**
   *
   * @param campaignQA
   */
  setParent(campaignQA: CampaignQA) {
    this.parent = campaignQA;
  }

  setChild(campaignQA: CampaignQA) {
    const alreadyExists = this.children.find(
      (currentCampaignQA: CampaignQA) =>
        currentCampaignQA.campaignQAId === campaignQA.campaignQAId,
    );

    if (!alreadyExists) {
      this.children.push(campaignQA);
    }
  }

  removeChild(campaignQA: CampaignQA) {
    const campaignQAIndex = this.children.findIndex(
      (currentCampaignQA: CampaignQA) =>
        currentCampaignQA.campaignQAId === campaignQA.campaignQAId,
    );

    if (campaignQAIndex > -1) {
      this.children.splice(campaignQAIndex, 1);
    }
  }

  /**
   *
   * @param {object} campaignQAObj
   * @returns CampaignQA
   */
  static createFromObject(campaignQAObj) {
    const campaignQA = new CampaignQA(
      campaignQAObj.campaignQAId,
      campaignQAObj.campaignId,
      campaignQAObj.userId,
      campaignQAObj.parentId,
      campaignQAObj.type,
      campaignQAObj.text,
    );

    if (campaignQAObj.user) {
      campaignQA.setUser(campaignQAObj.user);
    }

    if (campaignQAObj.parent) {
      campaignQA.setParent(campaignQAObj.parent);
    }

    if (campaignQAObj.campaign) {
      campaignQA.setCampaign(campaignQAObj.campaign);
    }

    if (campaignQAObj.createdAt) {
      campaignQA.setCreatedAt(campaignQAObj.createdAt);
    }
    if (campaignQAObj.updatedAt) {
      campaignQA.setUpdatedAt(campaignQAObj.updatedAt);
    }

    if (campaignQAObj.deletedAt) {
      campaignQA.setDeletedAT(campaignQAObj.deletedAt);
    }

    return campaignQA;
  }

  /**
   *
   * @param {string} campaignId
   * @param {string} userId
   * @param {string} parentId
   * @param {string} type
   * @param {string} text
   * @returns CampaignQA
   */
  static createFromDetail(
    campaignId: string,
    userId: string,
    parentId: string,
    type: string,
    text: string,
  ) {
    return new CampaignQA(uuid(), campaignId, userId, parentId, type, text);
  }
}

export default CampaignQA;
