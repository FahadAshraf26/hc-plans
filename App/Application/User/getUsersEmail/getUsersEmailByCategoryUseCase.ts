import { inject, injectable } from 'inversify';
import { IUserRepository, IUserRepositoryId } from '@domain/Core/User/IUserRepository';
import { IGetUsersEmailByCategoryUseCase } from '@application/User/getUsersEmail/IGetUsersEmailByCategoryUseCase';

@injectable()
class GetUsersEmailUseCaseByCategory implements IGetUsersEmailByCategoryUseCase {
  constructor(@inject(IUserRepositoryId) private userRepository: IUserRepository) {}

  async execute(dto) {
    return this.userRepository.fetchUsersEmailByCategory(
      dto.getUsersType(),
      dto.getStartDate(),
      dto.getEndDate(),
    );
  }
}

export default GetUsersEmailUseCaseByCategory;
