import { inject, injectable } from 'inversify';
import { IUserRepository, IUserRepositoryId } from '@domain/Core/User/IUserRepository';
import HttpError from '../../../Infrastructure/Errors/HttpException';
import { IDisableIdVerifiedPromptUseCase } from '@application/User/disableIdVerifiedPrompt/IDisableIdVerifiedPromptUseCase';

@injectable()
class DisabledIdVerifiedPromptUseCase implements IDisableIdVerifiedPromptUseCase {
  constructor(@inject(IUserRepositoryId) private userRepository: IUserRepository) {}

  async execute({ userId }) {
    const user = await this.userRepository.fetchById(userId);

    if (!user) {
      throw new HttpError(400, 'no resource found');
    }

    user.disableIdVerifiedPrompt();
    return this.userRepository.update(user);
  }
}

export default DisabledIdVerifiedPromptUseCase;
