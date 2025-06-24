
export enum ServiceClass {
  CreditDebit = 200,
  Credit = 220,
  Debit = 225,
};

export enum TransactionCode {
  CheckingCredit = 22,
  CheckingDebit = 27,
  SavingsCredit = 32,
  SavingsDebit = 37,
};

export enum BatchCode {
  ARC = 'ARC',
  BOC = 'BOC',
  CCD = 'CCD',
  CIE = 'CIE',
  CTX = 'CTX',
  IAT = 'IAT',
  POP = 'POP',
  POS = 'POS',
  PPD = 'PPD',
  RCK = 'RCK',
  TEL = 'TEL',
  WEB = 'WEB',
}

export const DEBIT_TYPES = [TransactionCode.CheckingDebit, TransactionCode.SavingsDebit];

export const CREDIT_TYPES = [TransactionCode.CheckingCredit, TransactionCode.SavingsCredit];

export const LINE_LENGTH = 94;

export const blankLine = '9'.repeat(LINE_LENGTH);

export const serviceClassFromNumber = (number: number) =>
  Object.keys(ServiceClass).find(
    (key) => ServiceClass[key as keyof typeof ServiceClass] === number,
  ) as keyof typeof ServiceClass | undefined;

export const batchCodeFromString = (str: string) =>
  Object.keys(BatchCode).find(
    (key) => BatchCode[key as keyof typeof BatchCode] === str,
  ) as keyof typeof BatchCode | undefined;

export const DEFAULTS_BATCH_HEADER = {
  originStatusCode: '1',
};

export const DEFAULTS_ENTRY = {
  recordTypeCode: '6',
};

export const DEFAULTS_ENTRY_ADDENDA = {
  recordTypeCode: '7',
  addendaTypeCode: '05',
  sequenceNumber: '1',
};

export const DEFAULTS_NACHA = {
  recordTypeCode: '1',
  priorityCode: '01',
  recordSize: `0${LINE_LENGTH}`,
  blockingFactor: '10',
  formatCode: '1',
};
