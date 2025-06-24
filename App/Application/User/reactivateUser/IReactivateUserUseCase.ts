export const IReactivateUserUseCaseId = Symbol.for('IReactivateUserUseCase');

export interface IReactivateUserUseCase {
  execute(dto: { userId: string }): Promise<boolean>;
}
