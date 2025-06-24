import { UseCase } from '@application/BaseInterface/UseCase';
import UpdateUserUseCaseDTO from '@application/User/updateUser/UpdateUserUseCaseDTO';

export const IUpdateUserUseCaseId = Symbol.for('IUpdateUserUseCase');
export interface IUpdateUserUseCase extends UseCase<UpdateUserUseCaseDTO, void> {
  guardAgainstDuplicateSSN(user: any, payload: any): Promise<void>;
  guardAgainstDuplicateEmail(user: any, payload: any): Promise<void>;
  execute(dto): Promise<any>;
}
