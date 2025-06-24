import { IBaseRepository } from '@domain/Core/BaseEntity/IBaseRepository';
import CampaignTag from './CampaignTag';
import Tag from '../Tag/Tag';
import Campaign from '../Campaign/Campaign';

export const ICampaignTagRepositoryId = Symbol.for('ICampaignTagRepository');

export interface ICampaignTagRepository extends IBaseRepository {
  add({ campaignId, campaignTags }): Promise<any>;
  getByCampaign(
    campaignId: string,
    paginationOptions,
    showTrashed: boolean,
  ): Promise<any>;
  fetchById(campaignTagId: string): Promise<CampaignTag>;
  fetchByTagId(tagId:string):Promise<CampaignTag>;
  upsert(campaignTag: CampaignTag): Promise<any>;
  remove(campaignId: string, hardDelete: boolean): Promise<boolean>;
  removeByTagId(tagId:string,hardDelete:boolean):Promise<boolean>;
  removeByTagCampaign(
    tag: Tag,
    campaign: Campaign,
    hardDelete: boolean,
  ): Promise<boolean>;
}
