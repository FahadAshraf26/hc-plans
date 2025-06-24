import config from '../../Config';
import * as crypto from 'crypto';
const { encryption: encryptionConfig } = config;

class EncryptionService {
  static encryptBankDetails(input) {
    return this.encrypt(
      input,
      encryptionConfig.BANK_SECRET_PASSWORD,
      encryptionConfig.BANK_IV,
    );
  }

  static decryptBankDetails(input) {
    return this.decrypt(
      input,
      encryptionConfig.BANK_SECRET_PASSWORD,
      encryptionConfig.BANK_IV,
    );
  }

  static encryptSsn(ssn) {
    return this.encrypt(
      ssn,
      encryptionConfig.SSN_SECRET_PASSWORD,
      encryptionConfig.SSN_IV,
    );
  }

  static decryptSsn(ssn) {
    return this.decrypt(
      ssn,
      encryptionConfig.SSN_SECRET_PASSWORD,
      encryptionConfig.SSN_IV,
    );
  }

  static encrypt(msg, password, iv, algorithm = 'aes-256-cbc') {
    const key = crypto.scryptSync(password, 'salt', 32);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(msg, 'utf-8', 'hex');
    return (encrypted += cipher.final('hex'));
  }

  static decrypt(msg, password, iv, algorithm = 'aes-256-cbc') {
    const key = crypto.scryptSync(password, 'salt', 32);
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(msg, 'hex', 'utf8');
    return (decrypted += decipher.final('utf-8'));
  }
}

export default EncryptionService;
