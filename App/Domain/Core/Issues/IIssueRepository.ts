import { IBaseRepository } from '@domain/Core/BaseEntity/IBaseRepository';
import Issue from '@domain/Core/Issues/Issue';
import PaginationData from '@domain/Utils/PaginationData';

export const IIssueRepositoryId = Symbol.for('IIssueRepository');

export interface IIssueRepository {
  add(issueEntity: Issue): Promise<boolean>;
  fetchAll({ paginationOptions }): Promise<PaginationData<any>>;
}
