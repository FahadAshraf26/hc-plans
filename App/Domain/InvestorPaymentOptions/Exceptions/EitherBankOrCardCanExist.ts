import DomainException from '../../Core/Exceptions/DomainException';

class EitherBankOrCardCanExist extends DomainException {
  constructor() {
    super();
    Error.captureStackTrace(this, EitherBankOrCardCanExist);
    this.name = 'EitherBankOrCardCanExist';
    this.message = 'Only One of Bank or Card can exist.';
  }
}

export default EitherBankOrCardCanExist;
