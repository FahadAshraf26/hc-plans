import { INCReturnRequest } from '@application/CampaignFund/FundReturnRequest/Utils/NCReturnRequest/INCReturnRequest';
import AdminUser from '@domain/Core/AdminUser/AdminUser';
import HybridTransaction from '@domain/Core/HybridTransactions/HybridTransaction';
import User from '@domain/Core/User/User';
import HttpError from '@infrastructure/Errors/HttpException';
import { northCapitalService } from '@infrastructure/Service/PaymentProcessor';
import { injectable } from 'inversify';

@injectable()
class NCReturnRequest implements INCReturnRequest {
  constructor() {}

  async execute({
    hybridTransaction,
    adminUser,
    user,
    ip,
  }: {
    hybridTransaction: HybridTransaction;
    adminUser: AdminUser;
    user: User;
    ip: string;
  }) {
    const refundByNC = await northCapitalService.fundReturnRequest({
      tradeId: hybridTransaction.getTradeId(),
      requestedBy: adminUser.getName(),
      reason: `${user.getFullName()} requested for Cancel/Refund on the basis of transaction status`,
      notes: `${user.getFullName()} requested for Cancel/Refund on the basis of transaction status`,
      ip,
    });

    if (!refundByNC) {
      throw new HttpError(400, 'refund process failed');
    }
    return true;
  }
}

export default NCReturnRequest;
