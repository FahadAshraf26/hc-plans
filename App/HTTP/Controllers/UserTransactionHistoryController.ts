import {
  IUserTransactionHistoryUsecase,
  IUserTransactionHistoryUsecaseId,
} from '@application/UserTransactionHistory/IUserTransactionHistoryUsecase';
import UserTransactionHistoryDTO from '@application/UserTransactionHistory/UserTransactionHistoryDTO';
import { inject, injectable } from 'inversify';

@injectable()
class UserTransactionHistoryController {
  constructor(
    @inject(IUserTransactionHistoryUsecaseId)
    private userTransactionHistory: IUserTransactionHistoryUsecase,
  ) {}

  getInvestorTransactionHistory = async (httpRequest) => {
    const { investorId } = httpRequest.params;
    const input = new UserTransactionHistoryDTO(investorId);
    const data = await this.userTransactionHistory.execute(input);
    return {
      body: {
        status: 'success',
        data,
      },
    };
  };

  getEntityTransactionHistory = async (httpRequest) => {
    const { investorId, entityId } = httpRequest.params;
    const input = new UserTransactionHistoryDTO(investorId, entityId);
    const data = await this.userTransactionHistory.execute(input);
    return {
      body: {
        status: 'success',
        data,
      },
    };
  };
}

export default UserTransactionHistoryController;
