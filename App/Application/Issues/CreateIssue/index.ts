const { IssueModel } = require('../../../Infrastructure/Model');
const IssueRepository = require('@infrastructure/MySQLRepository/IssueRepository');
import CreateIssueUseCase from './CreateIssueUseCase';

const issueRepository = new IssueRepository(IssueModel);
const createIssueUseCase = new CreateIssueUseCase(issueRepository);

export { createIssueUseCase };
