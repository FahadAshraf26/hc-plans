export const IWalletChargeId = Symbol.for('IWalletCharge');
export interface IWalletCharge{
  execute({ user, walletAmount, campaignFund,campaign,paymentOption ,dto}): Promise<any>;
}