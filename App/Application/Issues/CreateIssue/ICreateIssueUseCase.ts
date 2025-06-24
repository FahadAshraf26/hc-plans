import Issue from '@domain/Core/Issues/Issue';

export const ICreateIssueUseCaseId = Symbol.for('ICreateIssueUseCase');

export interface ICreateIssueUseCase {
  execute(dto): Promise<boolean>;
}
