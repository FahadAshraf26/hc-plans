export const IHybridChargeId = Symbol.for('IHybridCharge');
export interface IHybridCharge {
  execute({
    dto,
    campaign,
    user,
    paymentOption,
    transactionAmount,
    campaignFund,
    honeycombFee,
    walletBalance,
    honeycombDwollaCustomer,
    dwollaService
  }): Promise<any>;
}
