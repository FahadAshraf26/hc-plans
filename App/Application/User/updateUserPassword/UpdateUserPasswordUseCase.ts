import { inject, injectable } from 'inversify';
import {
  IUpdateUserUseCase,
  IUpdateUserUseCaseId,
} from '../updateUser/IUpdateUserUseCase';

import UpdateUserUseCaseDTO from '../updateUser/UpdateUserUseCaseDTO';

@injectable()
class UpdateUserPasswordUseCase {
  constructor(
    @inject(IUpdateUserUseCaseId) private updateUserUseCase: IUpdateUserUseCase,
  ) {}

  async execute({ userId, password, ip }) {
    const input = new UpdateUserUseCaseDTO(userId, { password }, ip);
    await this.updateUserUseCase.execute(input);
    return;
  }
}

export default UpdateUserPasswordUseCase;
