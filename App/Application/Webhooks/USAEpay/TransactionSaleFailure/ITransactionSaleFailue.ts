export const ITransactionSaleFailureId = Symbol.for('ITransactionSaleFailure');

export interface ITransactionSaleFailure {
  execute(event: any): Promise<any>;
}
