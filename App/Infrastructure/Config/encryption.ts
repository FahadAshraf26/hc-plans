import * as dotenv from 'dotenv';
dotenv.config();

export default {
  BANK_SECRET_PASSWORD: process.env.ENCRYPTION_BANK_SECRET_PASSWORD,
  BANK_IV: process.env.ENCRYPTION_BANK_IV,
  SSN_SECRET_PASSWORD: process.env.ENCRYPTION_SSN_SECRET_PASSWORD,
  SSN_IV: process.env.ENCRYPTION_SSN_IV,
};
