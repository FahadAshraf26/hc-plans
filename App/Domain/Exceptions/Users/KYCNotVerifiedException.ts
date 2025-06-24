import DomainException from '../../Core/Exceptions/DomainException';

class KYCNotVerifiedException extends DomainException {
  constructor() {
    super(
      'KYC check failed or Email not Verified, make sure all required information is correctly provided',
    );
    Error.captureStackTrace(this, KYCNotVerifiedException);
    this.name = 'KYCNotVerifiedException';
  }
}

export default KYCNotVerifiedException;
