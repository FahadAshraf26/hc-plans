import CampaignNewsMedia from '@domain/Core/CampaignNewsMedia/CampaignNewsMedia';
import { IBaseRepository } from '@domain/Core/BaseEntity/IBaseRepository';

export const ICampaignNewsMediaDaoId = Symbol.for('ICampaignNewsMediaDao');
export interface ICampaignNewsMediaDAO extends IBaseRepository {
  update(campaignNewsMedia: CampaignNewsMedia): Promise<boolean>;
}
