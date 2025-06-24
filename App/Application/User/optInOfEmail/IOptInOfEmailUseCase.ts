export const IOptInOfEmailUseCaseId = Symbol.for('IOptInOfEmailUseCase');

export interface IOptInOfEmailUseCase {
  execute(dto: { userId: string }): Promise<boolean>;
}
