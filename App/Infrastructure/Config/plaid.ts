import * as dotenv from 'dotenv';
dotenv.config();
import { Configuration, PlaidEnvironments } from 'plaid';

export const configuration = new Configuration({
  basePath: PlaidEnvironments[process.env.PLAID_ENVIRONMENT],
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
      'PLAID-SECRET': process.env.PLAID_SECRET,
      'Plaid-Version': '2020-09-14',
    },
  },
});

export const idvConfig = {
  templateId: process.env.PLAID_IDV_TEMPLATE_ID!, 
};