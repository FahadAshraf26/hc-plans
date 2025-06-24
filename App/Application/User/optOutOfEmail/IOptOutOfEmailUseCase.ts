export const IOptOutOfEmailUseCaseId = Symbol.for('IOptOutOfEmailUseCase');

export interface IOptOutOfEmailUseCase {
  execute(dto: { userId: string }): Promise<boolean>;
}
