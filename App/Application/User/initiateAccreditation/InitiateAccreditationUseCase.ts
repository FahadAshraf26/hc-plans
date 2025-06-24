import { IInitiateAccreditationUseCase } from '@application/User/initiateAccreditation/IInitiateAccreditationUseCase';
import {
  IInvestorAccreditationDAO,
  IInvestorAccreditationDAOId,
} from '@domain/Core/InvestorAccreditation/IInvestorAccreditationDAO';
import InvestorAccreditation from '@domain/Core/InvestorAccreditation/InvestorAccreditation';
import { IUserRepository, IUserRepositoryId } from '@domain/Core/User/IUserRepository';
// import { NorthCapitalAccreditationStatus } from '@domain/Core/ValueObjects/NorthCapitalAccreditationStatus';
import HttpError from '@infrastructure/Errors/HttpException';
// import { northCapitalService } from '@infrastructure/Service/PaymentProcessor';
import { inject, injectable } from 'inversify';
import InitiateAccreditationDTO from './InitiateAccreditationDTO';

@injectable()
class InitiateAccreditationUseCase implements IInitiateAccreditationUseCase {
  constructor(
    @inject(IUserRepositoryId) private userRepository: IUserRepository,
    @inject(IInvestorAccreditationDAOId)
    private investorAccreditationDAO: IInvestorAccreditationDAO,
  ) {}

  async execute(dto: InitiateAccreditationDTO) {
    const user = await this.userRepository.fetchById(dto.UserId());

    if (!user) {
      throw new HttpError(400, `resource ${dto.UserId()} not found`);
    }

    if (user.AccreditationStatus()) {
      throw new HttpError(400, 'Investor is already accredited');
    }

    user.markAsAccreditated();
    user.accreditedInvestorSubmissionAndDate();

    if (user.investor.ncAccountId) {
      // await northCapitalService.updateAccount(
      //   user.investor.ncAccountId,
      //   dto.getIP(),
      //   user.getFullName(),
      //   NorthCapitalAccreditationStatus.SELF_ACCREDITED,
      // );
    }

    await Promise.all([
      this.userRepository.update(user),
      this.saveAccreditationRecord(user),
    ]);

    return true;
  }

  async saveAccreditationRecord(user) {
    const investorAccreditation = InvestorAccreditation.createFromDetail(
      user.InvestorId(),
      user.AccreditationStatus(),
      new Date(),
    );

    return this.investorAccreditationDAO.add(investorAccreditation);
  }
}

export default InitiateAccreditationUseCase;
