import BankAccountType from '../../../Domain/InvestorPaymentOptions/BankAccountType';
import InvestorBank from '../../../Domain/InvestorPaymentOptions/InvestorBank';
import PaymentOptionType from '../../../Domain/InvestorPaymentOptions/PaymentOptionType';

type bankDetailsType = {
  accountNumber: string;
  routingNumber: string;
  accountType: string;
  bankName: string;
  nameOnAccount: string;
};

class AddManualBankAccountDTO {
  private bankDetails: {
    accountNumber: string;
    routingNumber: string;
    accountType: string;
    bankName: string;
    bankToken?: string;
  };
  private nameOnAccount: string;
  private userId: string;
  private investorId: string;
  private clientIp: string;

  constructor(
    {
      accountNumber,
      routingNumber,
      accountType,
      bankName,
      nameOnAccount,
    }: bankDetailsType,
    userId: string,
    clientIp: string,
  ) {
    this.bankDetails = {
      accountNumber,
      routingNumber,
      accountType,
      bankName,
    };
    this.nameOnAccount = nameOnAccount;
    this.userId = userId;
    this.clientIp = clientIp;
  }

  getNameOnAccount(): string {
    return this.nameOnAccount;
  }

  getPlaidToken(): string | undefined {
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

  getBankDetails(): InvestorBank {
    const bankName = this.bankDetails.bankName;
    const name = bankName
      ? `${bankName} ${this.bankDetails.accountType}`
      : `${this.bankDetails.accountType} account`;
    const accountType = BankAccountType.createFromValue(this.bankDetails.accountType);

    return InvestorBank.create({
      ...this.bankDetails,
      accountType,
      bankName: name,
      accountName: name,
    });
  }
}

export default AddManualBankAccountDTO;
