class DwollaToBankTransactionsFeeCalculation {
  constructor() {}

  static calculateDwollaTransferFee(amount: number): number {
    if (amount > 0 && amount <= 500) {
      return 0.2;
    } else if (amount >= 501 && amount <= 1000) {
      return 0.15;
    } else if (amount >= 1001 && amount <= 5000) {
      return 0.12;
    } else if (amount >= 5001 && amount <= 10000) {
      return 0.11;
    } else if (amount >= 10001 && amount <= 50000) {
      return 0.09;
    } else if (amount >= 50001 && amount <= 100000) {
      return 0.08;
    } else if (amount >= 100001 && amount <= 250000) {
      return 0.06;
    } else if (amount >= 250001 && amount <= 500000) {
      return 0.05;
    } else if (amount >= 500001 && amount <= 1000000) {
      return 0.04;
    } else if (amount >= 1000001) {
      return 0.03;
    } else {
      return 0;
    }
  }
}

export default DwollaToBankTransactionsFeeCalculation;
