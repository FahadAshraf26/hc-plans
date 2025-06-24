import HttpError from '../../../Infrastructure/Errors/HttpException';
import { inject, injectable } from 'inversify';
import { IUserRepository, IUserRepositoryId } from '@domain/Core/User/IUserRepository';
import { IDisablePortfolioVisitedPromptUseCase } from '@application/User/disablePortfolioVisitedPrompt.js/IDisablePortfolioVisitedPromptUseCase';

@injectable()
class DisablePortfolioVisitedPromptUseCase
  implements IDisablePortfolioVisitedPromptUseCase {
  constructor(@inject(IUserRepositoryId) private userRepository: IUserRepository) {}

  async execute({ userId }) {
    const user = await this.userRepository.fetchById(userId);

    if (!user) {
      throw new HttpError(400, 'no resource found');
    }

    user.disablePortfolioVisitedPrompt();
    return this.userRepository.update(user);
  }
}

export default DisablePortfolioVisitedPromptUseCase;
