import { inject, injectable } from 'inversify';
import { IUserRepository, IUserRepositoryId } from '@domain/Core/User/IUserRepository';
import { ISummaryUseCase } from '@application/User/summary/ISummaryUseCase';

@injectable()
class SummaryUseCase implements ISummaryUseCase {
  constructor(@inject(IUserRepositoryId) private userRepository: IUserRepository) {}

  async execute(dto) {
    return this.userRepository.getSummary(dto.getStartDate(), dto.getEndDate());
  }
}

export default SummaryUseCase;
