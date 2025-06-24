import * as dotenv from 'dotenv';
dotenv.config();

export default {
  EMAIL: process.env.THREAD_BANK_TRANSMITTAL_EMAIL,
  RECORD_KEEPING_EMAILS: process.env.NACHA_RECORD_KEEPING_EMAILS,
};
