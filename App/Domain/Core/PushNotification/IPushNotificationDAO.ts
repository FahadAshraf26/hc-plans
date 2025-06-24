import PaginationOptions from '@domain/Utils/PaginationOptions';
import PaginationData from '@domain/Utils/PaginationData';
import PushNotification from '@domain/Core/PushNotification/PushNotification';
import { IBaseRepository } from '@domain/Core/BaseEntity/IBaseRepository';

export const IPushNotificationDAOId = Symbol.for('IPushNotificationDAO');
type PushNotificationOptions = {
  paginationOptions: PaginationOptions;
  showFailed?: boolean;
};
export interface IPushNotificationDAO extends IBaseRepository {
  fetchByUserId(
    userId: string,
    { paginationOptions, showFailed }: PushNotificationOptions,
  ): Promise<PaginationData<PushNotification>>;
  setUserNotificationAsVisited(userId: string): Promise<boolean>;
  setCampaignQANotificationAsVisited(
    userId: string,
    campaignId: string,
  ): Promise<boolean>;
}
