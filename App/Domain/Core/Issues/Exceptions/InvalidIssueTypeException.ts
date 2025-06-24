import DomainException from '../../Exceptions/DomainException';

class InvalidIssueTypeException extends DomainException {
  constructor() {
    super();
    Error.captureStackTrace(this, InvalidIssueTypeException);
    this.name = 'InvalidIssueTypeException';
    this.message = 'Invalid Issue Type';
  }
}

export default InvalidIssueTypeException;
