import HybridTransaction from '@domain/Core/HybridTransactions/HybridTransaction';

export const IHybridReturnRequestId = Symbol.for('IHybridReturnRequest');

export interface IHybridReturnRequest {
  execute(hybridTransaction: HybridTransaction, dwollaCustomer: any): Promise<boolean>;
}
