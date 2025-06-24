import DomainException from '../../Core/Exceptions/DomainException';

class EmailNotVerifiedException extends DomainException {
  name: string;

  constructor() {
    super(
      'KYC check failed or Email not Verified, make sure all required information is correctly provided',
    );
    Error.captureStackTrace(this, EmailNotVerifiedException);
    this.name = 'EmailNotVerifiedException';
  }
}

export default EmailNotVerifiedException;
