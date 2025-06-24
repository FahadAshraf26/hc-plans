import {UseCase} from '@application/BaseInterface/UseCase';

export const IUpdateUserNewPasswordUseCaseId = Symbol.for('IUpdateUserNewPasswordUseCase');

export interface IUpdateUserNewPasswordUseCase
    extends UseCase<{ userId: string; password: string; ip: string }, any> {
}
