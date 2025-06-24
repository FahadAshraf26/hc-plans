import HttpError from '../../../Infrastructure/Errors/HttpException';
import { IUserRepository, IUserRepositoryId } from '@domain/Core/User/IUserRepository';
import {
  IInvestorPaymentOptionsRepository,
  IInvestorPaymentOptionsRepositoryId,
} from '@domain/InvestorPaymentOptions/IInvestorPaymentOptionsRepository';
// import { northCapitalService } from '../../../Infrastructure/Service/PaymentProcessor';
import { injectable, inject } from 'inversify';
import { IDeleteInvestorPaymentOptionUseCase } from './IDeleteInvestorPaymentOptionUseCase';

@injectable()
class DeleteInvestorPaymentOptionUseCase implements IDeleteInvestorPaymentOptionUseCase {
  constructor(
    @inject(IUserRepositoryId) private userRepository: IUserRepository,
    @inject(IInvestorPaymentOptionsRepositoryId)
    private investorPaymentOptionRepository: IInvestorPaymentOptionsRepository,
  ) {}

  async execute(dto) {
    const paymentOption: any = await this.investorPaymentOptionRepository.fetchById(
      dto.getInvestorPaymentOptionId(),
    );

    if (!paymentOption || paymentOption.getInvestorId() !== dto.getInvestorId()) {
      throw new HttpError(400, 'Resource not found');
    }

    const user = await this.userRepository.fetchByInvestorId(dto.getInvestorId());

    if (paymentOption.isCard()) {
      return this.deleteCard(paymentOption, user, dto);
    } else {
      return this.deleteBank(paymentOption, user, dto);
    }
  }

  async deleteCard(paymentOption, user, dto) {
    // await northCapitalService.deleteCreditCard(
    //   user.investor.ncAccountId,
    //   dto.getIpAddress(),
    // );
    await this.investorPaymentOptionRepository.remove(paymentOption);
    return true;
  }

  async deleteBank(paymentOption, user, dto) {
    // await northCapitalService.removeExternalAccount({
    //   accountId: user.investor.ncAccountId,
    // });
    await this.investorPaymentOptionRepository.remove(paymentOption);
    return true;
  }
}

export default DeleteInvestorPaymentOptionUseCase;
