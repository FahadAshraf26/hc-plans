export const ITransactionSaleSuccessId = Symbol.for('ITransactionSaleSuccess');

export interface ITransactionSaleSuccess {
  execute(event: any): Promise<any>;
}
