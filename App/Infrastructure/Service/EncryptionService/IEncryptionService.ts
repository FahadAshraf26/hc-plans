export const IEncryptionServiceId = Symbol.for('IEncryptionService');

export interface IEncryptionService {
  encryptBankDetails(input);
  decryptBankDetails(input);
  encryptSsn(ssn);
  decryptSsn(ssn);
  encrypt(msg, password, iv, algorithm);
  decrypt(msg, password, iv, algorithm);
}
