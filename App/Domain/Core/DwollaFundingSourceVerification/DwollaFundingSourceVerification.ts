import uuid from 'uuid/v4';

class DwollaFundingSourceVerification {
  private dwollaFundingSourceVerificationId: string;
  private isMicroDepositInitiated: boolean | false;
  private microDepositInitiatedAt: Date | null;
  private firstTransactionAmount: number | null;
  private secondTransactionAmount: number | null;
  private isFundingSourceVerified: boolean | false;
  private dwollaSourceId: string | null;
  private createdAt: Date;
  private updatedAt: Date;
  private deletedAt;

  constructor(
    dwollaFundingSourceVerificationId: string,
    isMicroDepositInitiated: boolean,
    microDepositInitiatedAt: Date,
    firstTransactionAmount: number,
    secondTransactionAmount: number,
    isFundingSourceVerified: boolean,
  ) {
    this.dwollaFundingSourceVerificationId = dwollaFundingSourceVerificationId;
    this.isMicroDepositInitiated = isMicroDepositInitiated;
    this.microDepositInitiatedAt = microDepositInitiatedAt;
    this.firstTransactionAmount = firstTransactionAmount;
    this.secondTransactionAmount = secondTransactionAmount;
    this.isFundingSourceVerified = isFundingSourceVerified;
  }

  setDwollaSourceId(dwollaSourceId: string) {
    this.dwollaSourceId = dwollaSourceId;
  }

  getDwollaSourceId() {
    return this.dwollaSourceId;
  }

  getDwollaFundingSourceVerification() {
    return this.dwollaFundingSourceVerificationId;
  }

  getIsMicroDepositInitiated() {
    return this.isMicroDepositInitiated;
  }

  getMicroDepositInitiatedAt() {
    return this.microDepositInitiatedAt;
  }
  getFirstTransactionAmount() {
    return this.firstTransactionAmount;
  }

  getSecondTransactionAmount() {
    return this.secondTransactionAmount;
  }

  getIsFundingSourceVerified() {
    return this.isFundingSourceVerified;
  }

  setCreatedAt(createdAt) {
    this.createdAt = createdAt;
  }

  getCreatedAt() {
    return this.createdAt;
  }

  setUpdatedAt(updatedAt) {
    this.updatedAt = updatedAt;
  }

  getUpdatedAt() {
    return this.updatedAt;
  }

  setDeletedAt(deletedAt) {
    this.deletedAt = deletedAt;
  }

  getDeletedAt() {
    return this.deletedAt;
  }

  static createFromObject(dwollaFundingSourceVerificationObj) {
    const dwollaFundingSourceVerification = new DwollaFundingSourceVerification(
      dwollaFundingSourceVerificationObj.dwollaFundingSourceVerificationId,
      dwollaFundingSourceVerificationObj.isMicroDepositInitiated,
      dwollaFundingSourceVerificationObj.microDepositInitiatedAt,
      dwollaFundingSourceVerificationObj.firstTransactionAmount,
      dwollaFundingSourceVerificationObj.secondTransactionAmount,
      dwollaFundingSourceVerificationObj.isFundingSourceVerified,
    );

    if (dwollaFundingSourceVerificationObj.dwollaSourceId) {
      dwollaFundingSourceVerification.setDwollaSourceId(
        dwollaFundingSourceVerificationObj.dwollaSourceId,
      );
    }

    if (dwollaFundingSourceVerificationObj.createdAt) {
      dwollaFundingSourceVerification.setCreatedAt(
        dwollaFundingSourceVerificationObj.createdAt,
      );
    }

    if (dwollaFundingSourceVerificationObj.updatedAt) {
      dwollaFundingSourceVerification.setUpdatedAt(
        dwollaFundingSourceVerificationObj.updatedAt,
      );
    }

    if (dwollaFundingSourceVerificationObj.deletedAt) {
      dwollaFundingSourceVerification.setDeletedAt(
        dwollaFundingSourceVerificationObj.deletedAt,
      );
    }

    return dwollaFundingSourceVerification;
  }

  static createFromDetails(
    isMicroDepositInitiated: boolean = false,
    microDepositInitiatedAt: Date = null,
    firstTransactionAmount: number = null,
    secondTransactionAmount: number = null,
    isFundingSourceVerified: boolean = false,
  ) {
    const dwollaFundingSourceVerification = new DwollaFundingSourceVerification(
      uuid(),
      isMicroDepositInitiated,
      microDepositInitiatedAt,
      firstTransactionAmount,
      secondTransactionAmount,
      isFundingSourceVerified,
    );

    return dwollaFundingSourceVerification;
  }
}

export default DwollaFundingSourceVerification;
