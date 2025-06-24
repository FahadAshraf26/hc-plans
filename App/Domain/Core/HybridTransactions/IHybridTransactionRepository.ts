import HybridTransaction from '@domain/Core/HybridTransactions/HybridTransaction';
import { IBaseRepository } from '../BaseEntity/IBaseRepository';

export const IHybridTransactionRepoistoryId = Symbol.for('IHybridTransactionRepoistory');
export interface IHybridTransactionRepoistory extends IBaseRepository {
  fetchAllByCampaignFundId(
    campaignFundId: string,
    allowedStatuses?: Array<string>,
  ): Promise<any>;
  fetchAllWalletTransactions(): Promise<any>;
  fetchByTradeId(tradeId: string): Promise<HybridTransaction>;
  fetchAllWalletThreadBankPendingRefundTransactions(): Promise<Array<HybridTransaction>>;
  updateStatusAndDebitAuthorizationId(
    hybridTransactionId: string,
    status: string,
    debitAuthorizationId: string,
  ): Promise<boolean>;
  updateStatusAndNachaFileName(
    hybridTransactionId: string,
    status: string,
    nachaFileName: string,
  ): Promise<boolean>;
  fetchAllByDebitAuthorizationId(
    debitAuthorizationId: string,
  ): Promise<Array<HybridTransaction>>;
  fetchAllByNachaFileName(nachaFileName: string): Promise<Array<HybridTransaction>>;
  fetchAllByNachaFileNameForAchRefundStatus(nachaFileNames: string[]): Promise<any>;
  fetchAllWalletThreadBankRefundApprovedTransactions(): Promise<Array<HybridTransaction>>;
  fetchAllAchThreadBankPendingRefundTransactions(): Promise<Array<any>>;
  getAchRefundStatusUpdate(): Promise<any>;
}
