export const IBankChargeId = Symbol.for('IBankCharge');
export interface IBankCharge {
  execute({
    dto,
    campaign,
    user,
    paymentOption,
    amountToCharge,
    transactionAmount,
    campaignFund,
    honeycombFee,
  }): Promise<any>;
}
