import HybridTransaction from '@domain/Core/HybridTransactions/HybridTransaction';

export const IWalletReturnRequestId = Symbol.for('IWalletReturnRequest');

export interface IWalletReturnRequest {
  execute(hybridTransaction: HybridTransaction, dwollaCustomer: any): Promise<boolean>;
}
