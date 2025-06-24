import * as dotenv from 'dotenv';
dotenv.config();

// const REDIRECT_URL = "https://124f9b92.ngrok.io/api/v1/investReady/redirect";
const REDIRECT_URL = `${process.env.SERVER_URL}/api/v1/investReady/redirect`;

export default {
  API_BASE_URL: process.env.INVEST_READY_API_BASE_URL,
  CLIENT_ID: process.env.INVEST_READY_CLIENT_ID,
  CLIENT_SECRET: process.env.INVEST_READY_CLIENT_SECRET,
  REDIRECT_URL,
  SIGNUP_URL: `${process.env.INVEST_READY_API_BASE_URL}/oauth/authorize?client_id=${process.env.INVEST_READY_CLIENT_ID}&redirect_uri=${REDIRECT_URL}&response_type=code`,
};
