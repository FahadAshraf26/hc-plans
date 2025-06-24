import DeactivateUserDTO from './DeactivateUserDTO';

export const IDeactivateUserUseCaseId = Symbol.for('IDeactivateUserUseCase');

export interface IDeactivateUserUseCase {
  execute(dto: DeactivateUserDTO): Promise<boolean>;
}
