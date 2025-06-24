import PaymentOptionType from '@domain/InvestorPaymentOptions/PaymentOptionType';

type bankDetailsType = {
  bankToken: string;
  accountId: string;
  accountType: string;
  bankName: string;
};

class AddBankAccountDTO {
  private bankDetails: bankDetailsType;
  private userId: string;
  private investorId: string;
  private clientIp: string;

  constructor(
    { publicToken: bankToken, accountId, accountType, bankName },
    userId,
    clientIp,
  ) {
    this.bankDetails = {
      bankToken,
      accountId,
      accountType,
      bankName,
    };
    this.userId = userId;
    this.clientIp = clientIp;
  }

  getPlaidToken(): string {
    return this.bankDetails.bankToken;
  }

  getIp(): string {
    return this.clientIp;
  }

  getUserId(): string {
    return this.userId;
  }

  getPaymentOptionType(): PaymentOptionType {
    return PaymentOptionType.Bank();
  }

  getBankDetails(): bankDetailsType {
    return this.bankDetails;
  }
}

export default AddBankAccountDTO;
