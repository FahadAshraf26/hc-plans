import { ICheckEmailAvaliabilityUseCase } from '@application/User/checkEmailAvailability/ICheckEmailAvaliabilityUseCase';
import { IUserRepository, IUserRepositoryId } from '@domain/Core/User/IUserRepository';
import HttpError from '@infrastructure/Errors/HttpException';
import { inject, injectable } from 'inversify';

@injectable()
class CheckEmailAvailabilityUseCase implements ICheckEmailAvaliabilityUseCase {
  constructor(@inject(IUserRepositoryId) private userRepository: IUserRepository) {}

  async execute({ email }) {
    const user = await this.userRepository.fetchByEmail(email, true);

    if (!user) {
      return true;
    }

    if (user.deletedAt) {
      throw new HttpError(
        403,
        'This account was recently deleted. Please email support@honeycombcredit.com to reactivate this account.',
      );
    }

    throw new HttpError(403, 'The email entered is already being used or is not valid.');
  }
}

export default CheckEmailAvailabilityUseCase;
