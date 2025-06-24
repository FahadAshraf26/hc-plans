import uuid from 'uuid/v4';
import User from '../User/User';
import IssueType from './IssueType';

type IssueProps = {
  reportedBy?: string;
  issueType?: IssueType;
  resourceId?: string;
  issueInfo?: string;
};

class Issue {
  _issueId: string;
  _props: any;

  constructor(issueId: string, props: any) {
    this._issueId = issueId;
    this._props = props;
  }

  issueId() {
    return this._issueId;
  }

  issueType() {
    return this._props.issueType.value();
  }

  reportedBy() {
    return this._props.reportedBy;
  }

  resourceId() {
    return this._props.resourceId;
  }

  issueInfo() {
    return this._props.issueInfo;
  }

  /**
   *  @param {User} reporter
   *  */
  setReporter(reporter: User) {
    this._props.reporter = reporter;
  }

  reporter() {
    return this._props.reporter;
  }

  /**
   * @typedef {{reportedBy: string,issueType: IssueType,resourceId: string, issueInfo: string }} IssueProps
   * @param {IssueProps} issueProps
   * @param {String} issueId
   * */
  static create(issueProps: IssueProps, issueId: string) {
    if (!issueId) {
      issueId = uuid();
    }

    return new Issue(issueId, issueProps);
  }
}

export default Issue;
