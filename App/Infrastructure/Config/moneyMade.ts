import * as dotenv from 'dotenv';
dotenv.config();

export default {
  MONEYMADE_API_BASE_URL: process.env.MONEYMADE_API_BASE_URL,
  MONEYMADE_PRIVATE_KEY: process.env.MONEYMADE_PRIVATE_KEY,
  MONEYMADE_PUBLIC_KEY: process.env.MONEYMADE_PUBLIC_KEY,
};
