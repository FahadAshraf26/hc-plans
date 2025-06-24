import { injectable, inject } from 'inversify';
import HttpError from '../../../Infrastructure/Errors/HttpException';
import GetInvestorPaymentOptionsDTO from './GetInvestorPaymentOptionsDTO';
import { IUserRepository, IUserRepositoryId } from '@domain/Core/User/IUserRepository';
import {
  IInvestorPaymentOptionsRepository,
  IInvestorPaymentOptionsRepositoryId,
} from '@domain/InvestorPaymentOptions/IInvestorPaymentOptionsRepository';
import { IGetInvestorPaymentOptionsUseCase } from './IGetInvestorPaymentOptionsUseCase';

@injectable()
class GetInvestorPaymentOptionsUseCase implements IGetInvestorPaymentOptionsUseCase {
  constructor(
    @inject(IUserRepositoryId) private userRepository: IUserRepository,
    @inject(IInvestorPaymentOptionsRepositoryId)
    private investorPaymentOptionRepository: IInvestorPaymentOptionsRepository,
  ) {}

  async execute(getInvestorPaymentOptionsDTO: GetInvestorPaymentOptionsDTO) {
    const user = await this.userRepository.fetchById(
      getInvestorPaymentOptionsDTO.getUserId(),
    );

    if (!user) {
      throw new HttpError(400, 'no user found against provided input');
    }

    const result = await this.investorPaymentOptionRepository.fetchAllByInvestor({
      investorId: user.investor.investorId,
      paginationOptions: getInvestorPaymentOptionsDTO.getPaginationOptions(),
      showTrashed: getInvestorPaymentOptionsDTO.shouldShowTrashed(),
    });

    return result.getPaginatedData();
  }
}

export default GetInvestorPaymentOptionsUseCase;
