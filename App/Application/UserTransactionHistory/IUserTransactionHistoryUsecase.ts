import UserTransactionHistoryDTO from "./UserTransactionHistoryDTO";

export const IUserTransactionHistoryUsecaseId = Symbol.for('IUserTransactionHistoryUsecase');

export interface IUserTransactionHistoryUsecase {
  execute(userTransactionHistoryDTO: UserTransactionHistoryDTO): Promise<any>;
};