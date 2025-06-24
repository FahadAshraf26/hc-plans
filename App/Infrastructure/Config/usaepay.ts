import * as dotenv from 'dotenv';
dotenv.config();

export default {
  firstCitizenBank: {
    API_KEY: process.env.USAePay_FIRST_CITIZEN_BANK_API_KEY,
    SEED: process.env.USAePay_FIRST_CITIZEN_BANK_SEED,
    PIN: process.env.USAePay_FIRST_CITIZEN_BANK_API_PIN,
  },
  threadBank: {
    API_KEY: process.env.USAePay_THREAD_BANK_API_KEY,
    SEED: process.env.USAePay_THREAD_BANK_SEED,
    PIN: process.env.USAePay_THREAD_BANK_API_PIN,
  },
  BASE_URL: `https://secure.usaepay.com/api/v2`,
  HEADERS: {
    'Content-Type': 'application/json',
  },
};