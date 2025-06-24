import * as dotenv from 'dotenv';
dotenv.config();

import serverConfig from './server';

const server = serverConfig;

const sandboxURL = 'api-sandboxdash.norcapsecurities.com';
const prodURL = 'api.norcapsecurities.com';
const newSandboxURL = 'tapi-sandboxdash.norcapsecurities.com';
const newProdUrl = 'tapi.norcapsecurities.com'

export default {
  clientID: process.env.NORTH_CAPITAL_CLIENT_ID,
  developerAPIKey: process.env.NORTH_CAPITAL_DEVELOPER_API_KEY,
  baseURL: `https://${server.IS_PRODUCTION ? prodURL : sandboxURL}/tapiv3/index.php/v3`,
  webhookURL: `https://${server.IS_PRODUCTION ? prodURL : sandboxURL}/admin_v3/client`,
  newBaseURL: `https://${server.IS_PRODUCTION? newProdUrl: newSandboxURL}`,

  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
};
