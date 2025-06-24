import { UseCase } from '@application/BaseInterface/UseCase';
import getUsersEmailByCategoryDTO from '@application/User/getUsersEmail/getUsersEmailByCategoryDTO';

export const IGetUsersEmailByCategoryUseCaseId = Symbol.for(
  'IGetUsersEmailByCategoryUseCase',
);
export interface IGetUsersEmailByCategoryUseCase
  extends UseCase<getUsersEmailByCategoryDTO, any> {}
