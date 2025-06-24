export const IePayChargeId = Symbol.for('IePayCharge');
export interface IePayCharge {
  execute({
    campaign,
    user,
    amountToCharge,
    transactionAmount,
    campaignFund,
    fee,
    dto,
    stripeFee
  }): Promise<any>;
}
