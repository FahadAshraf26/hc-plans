import HybridTransaction from '@domain/Core/HybridTransactions/HybridTransaction';

export const IFCReturnRequestId = Symbol.for('IFCReturnRequest');
export interface IFCReturnRequest {
  execute(hybridTransaction: HybridTransaction): Promise<Boolean>;
}
