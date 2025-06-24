import AdminUser from '@domain/Core/AdminUser/AdminUser';
import HybridTransaction from '@domain/Core/HybridTransactions/HybridTransaction';
import User from '@domain/Core/User/User';

export const INCReturnRequestId = Symbol.for('INCReturnRequest');
export interface INCReturnRequest {
  execute(obj: {
    hybridTransaction: HybridTransaction;
    adminUser: AdminUser;
    user: User;
    ip: string;
  }): Promise<boolean>;
}
