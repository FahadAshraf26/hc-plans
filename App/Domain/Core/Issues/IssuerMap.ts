import Issue from './Issue';
import IssueType from './IssueType';

class IssuerMap {
  static toDomain(issueObj) {
    const issueType = IssueType.createFromValue(issueObj.issueType);
    const issueEntity = Issue.create({ ...issueObj, issueType }, issueObj.issueId);

    if (issueObj.reporter) {
      issueEntity.setReporter(issueObj.reporter);
    }
    return issueEntity;
  }

  /**
   *
   * @param  {Issue} issueEntity
   * @returns {{issueType: *, issueId: *}}
   */
  static toPersistence(issueEntity: Issue) {
    return {
      issueId: issueEntity.issueId(),
      issueType: issueEntity.issueType(),
      reportedBy: issueEntity.reportedBy(),
      resourceId: issueEntity.resourceId(),
      issueInfo: issueEntity.issueInfo(),
    };
  }

  /**
   *
   * @param  {Issue} issueEntity
   * */
  static toDTO(issueEntity) {
    const obj = {
      issueId: issueEntity.issueId(),
      issueType: issueEntity.issueType(),
      reportedBy: issueEntity.reportedBy(),
      resourceId: issueEntity.resourceId(),
      issueInfo: issueEntity.issueInfo(),
      reporter: issueEntity.reporter(),
    };

    if (issueEntity.reporter()) {
      obj.reporter = {
        email: issueEntity.reporter().email || '',
      };
    }

    return obj;
  }
}

export default IssuerMap;
