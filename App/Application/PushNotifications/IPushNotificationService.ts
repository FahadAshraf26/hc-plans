import { PaginationDataResponse } from '@domain/Utils/PaginationData';
import PushNotification from '@domain/Core/PushNotification/PushNotification';
import GetUserNotificationsDTO from '@application/PushNotifications/GetUserNotificationsDTO';
import UpdateUserNotificationDTO from '@application/PushNotifications/UpdateUserNotificationDTO';
import Campaign from '@domain/Core/Campaign/Campaign';
import CampaignQA from '@domain/Core/CampaignQA/CampaignQA';
import User from '@domain/Core/User/User';
import MarkUserNotificationAsVisitedDTO from '@application/PushNotifications/MarkUserNotificationAsVisitedDTO';
import MarkCampaignQANotificationDTO from '@application/PushNotifications/MarkCampaignQANotificationDTO';

export const IPushNotificationServiceId = Symbol.for('IPushNotificationService');
export interface IPushNotificationService {
  getUserNotifications(
    getUserNotificationsDTO: GetUserNotificationsDTO,
  ): Promise<PaginationDataResponse<PushNotification>>;
  updateUserNotification(
    updateUserNotificationDTO: UpdateUserNotificationDTO,
  ): Promise<boolean>;
  sendGlobalNotification(
    inputUsers: any,
    subject: string,
    body: any,
    data: any,
  ): Promise<boolean>;
  sendSuccessfulCampaignNotifications(campaign: Campaign, users: any): Promise<boolean>;
  sendNewCampaignQANotifications(
    campaignQA: CampaignQA,
    user: User,
    ownerUsers: any,
    issuerId: string,
  ): Promise<boolean>;
  sendUnSuccessfulCampaignNotifications(campaign: Campaign, users: any): Promise<boolean>;
  setUserNotificationAsMarked(
    markUserNotificationAsVisitedDTO: MarkUserNotificationAsVisitedDTO,
  ): Promise<boolean>;
  setCampaignQANotificationAsMarked(
    markCampaignQANotificationDTO: MarkCampaignQANotificationDTO,
  ): Promise<boolean>;
  sendIdologyIdVerifiedNotification(user: User): Promise<boolean>;
  sendNewCampaignNotifications(campaign): Promise<boolean>;
}
