import BankType from '../BankAccountType';
import InvestorBank from '../InvestorBank';

class InvestorBankMap {
  static toDomain(investorBankObj) {
    const accountType = BankType.createFromValue(investorBankObj.accountType);
    const dwollaFundingSourceId = investorBankObj.dwollaFundingSourceId;
    const investorPaymentOptionsId = investorBankObj.investorPaymentOptionsId;
    return InvestorBank.create(
      {
        ...investorBankObj,
        accountType,
        dwollaFundingSourceId,
        investorPaymentOptionsId,
      },
      investorBankObj.investorBankId,
    );
  }

  static toPersistence(investorBankEntity) {
    return {
      investorPaymentOptionsId: investorBankEntity.getParentId(),
      investorBankId: investorBankEntity.getInvestorBankId(),
      accountType: investorBankEntity.getAccountType(),
      accountNumber: investorBankEntity.getAccountNumber(),
      lastFour: investorBankEntity.getLastFour(),
      routingNumber: investorBankEntity.getRoutingNumber(),
      wireRoutingNumber: investorBankEntity.getWireRoutingNumber(),
      bankName: investorBankEntity.getBankName(),
      accountName: investorBankEntity.getAccountName(),
      bankToken: investorBankEntity.getToken(),
      dwollaFundingSourceId: investorBankEntity.getDwollaFundingSourceId(),
    };
  }

  static toDTO(investorBankEntity) {
    return {
      investorBankId: investorBankEntity.getInvestorBankId(),
      accountType: investorBankEntity.getAccountType(),
      lastFour: investorBankEntity.getLastFour(),
      bankName: investorBankEntity.getBankName(),
      accountName: investorBankEntity.getAccountName(),
      createdAt: investorBankEntity.getCreatedAt(),
      updatedAt: investorBankEntity.getUpdatedAt(),
      deletedAt: investorBankEntity.getDeletedAt(),
      dwollaFundingSourceId: investorBankEntity.getDwollaFundingSourceId(),
    };
  }
}

export default InvestorBankMap;
