import * as dotenv from 'dotenv';
dotenv.config();

export default {
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  STRIPE_CONNECTED_ACCOUNT_ID: process.env.STRIPE_CONNECTED_ACCOUNT_ID
};
