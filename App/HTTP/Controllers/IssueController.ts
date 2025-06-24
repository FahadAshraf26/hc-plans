/**
 * @typedef {import('../Utils/makeExpressCallback').HttpRequest} HttpRequest
 * @typedef {import('../Utils/makeExpressCallback').HttpResponse} HttpResponse
 */
import { inject, injectable } from 'inversify';
import {
  ICreateIssueUseCase,
  ICreateIssueUseCaseId,
} from '@application/Issues/CreateIssue/ICreateIssueUseCase';

@injectable()
class IssueController {
  constructor(
    @inject(ICreateIssueUseCaseId) private createIssueUseCase: ICreateIssueUseCase,
  ) {}
  /**
   *
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  addIssue = async (httpRequest) => {
    const body = httpRequest.body;

    const dto = {
      issueType: body.issueType,
      resourceId: body.resourceId,
      issueInfo: body.issueInfo,
      reportedBy: httpRequest.decoded.userId,
    };

    await this.createIssueUseCase.execute(dto);

    return {
      body: {
        status: 'success',
        message: 'Issue reported successfully!',
      },
    };
  };
}

export default IssueController;
