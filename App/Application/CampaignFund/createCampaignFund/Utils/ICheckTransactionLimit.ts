export const ICheckTransactionLimitId = Symbol.for('ICheckTransactionLimit');
export interface ICheckTransactionLimit {
  execute(dto, campaignFund): any;
}
