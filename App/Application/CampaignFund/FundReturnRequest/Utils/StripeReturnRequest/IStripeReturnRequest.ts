import HybridTransaction from '@domain/Core/HybridTransactions/HybridTransaction';

export const IStripeReturnRequestId = Symbol.for('IStripeReturnRequest');

export interface IStripeReturnRequest {
  execute(hybridTransaction: HybridTransaction): Promise<boolean>;
}
