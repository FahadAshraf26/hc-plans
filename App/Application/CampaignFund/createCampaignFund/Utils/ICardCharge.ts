export const ICardChargeId = Symbol.for('ICardCharge');
export interface ICardCharge {
  execute({
    dto,
    campaign,
    user,
    paymentOption,
    amountToCharge,
    transactionAmount,
    campaignFund,
    fee,
    stripeFee,
  }): Promise<any>;
}
