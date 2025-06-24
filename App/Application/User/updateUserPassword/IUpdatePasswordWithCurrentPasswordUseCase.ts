import { UseCase } from '@application/BaseInterface/UseCase';

export const IUpdatePasswordWithCurrentPasswordUseCaseId = Symbol.for(
  'IUpdatePasswordWithCurrentPasswordUseCase',
);

export interface IUpdatePasswordWithCurrentPasswordUseCase
  extends UseCase<
    { userId: string; password: string; currentPassword: string; ip: string },
    any
  > {}
