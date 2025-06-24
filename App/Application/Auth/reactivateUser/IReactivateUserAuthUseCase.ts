import { UseCase } from '@application/BaseInterface/UseCase';
import ReactivateUserDTO from './ReactivateUserDTO';

export const IReactivateUserAuthUseCaseId = Symbol.for('IReactivateUserAuthUseCase');

export interface IReactivateUserAuthUseCase extends UseCase<ReactivateUserDTO, boolean> {}
