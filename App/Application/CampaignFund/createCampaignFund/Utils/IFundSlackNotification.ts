export const IFundSlackNotificationId = Symbol.for('IFundSlackNotification');
export interface IFundSlackNotification {
  execute(
    user: any,
    campaignFund: any,
    campaign: any,
    transactionType: any,
    amount: any,
    canAvailPromotionCredits: boolean,
  ): Promise<any>;
}
