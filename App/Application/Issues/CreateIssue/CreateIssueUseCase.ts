import IssueType from '../../../Domain/Core/Issues/IssueType';
import Issue from '../../../Domain/Core/Issues/Issue';
import DomainException from '../../../Domain/Core/Exceptions/DomainException';
import HttpError from '../../../Infrastructure/Errors/HttpException';
import IssueRepository from '../../../Infrastructure/MySQLRepository/IssueRepository';
import { inject, injectable } from 'inversify';
import { IIssueRepositoryId } from '@domain/Core/Issues/IIssueRepository';
import { ICreateIssueUseCase } from '@application/Issues/CreateIssue/ICreateIssueUseCase';

@injectable()
class CreateIssueUseCase implements ICreateIssueUseCase {
  constructor(@inject(IIssueRepositoryId) private issueRepository: IssueRepository) {}

  async execute(dto) {
    try {
      const issueType = IssueType.createFromValue(dto.issueType);
      const issue = Issue.create({ ...dto, issueType }, '');

      return this.issueRepository.add(issue);
    } catch (err) {
      if (err instanceof DomainException) {
        throw new HttpError(400, err.message);
      }

      throw err;
    }
  }
}

export default CreateIssueUseCase;
