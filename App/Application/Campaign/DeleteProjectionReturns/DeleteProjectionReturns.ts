import {
  IInvestorPaymentsRepositoryId,
  IInvestorPaymentsRepository,
} from '@domain/Core/InvestorPayments/IInvestorPaymentsRepository';
import {
  IRepaymentsRepositoryId,
  IRepaymentsRepository,
} from '@domain/Core/Repayments/IRepaymentsRepository';
import { IDeleteProjectionReturns } from './IDeleteProjectionReturns';
import { inject, injectable } from 'inversify';

@injectable()
class DeleteProjectionReturns implements IDeleteProjectionReturns {
  constructor(
    @inject(IRepaymentsRepositoryId) private repaymentRepository: IRepaymentsRepository,
    @inject(IInvestorPaymentsRepositoryId)
    private investorPaymentsRepository: IInvestorPaymentsRepository,
  ) {}

  async execute(campaignId: string) {
    const lastPaymentDate = await this.repaymentRepository.getLastRepaymentDate(
      campaignId,
    );
      await this.investorPaymentsRepository.deleteProjectionReturns(campaignId, lastPaymentDate);
  }
}

export default DeleteProjectionReturns;
