import * as dotenv from 'dotenv';
dotenv.config();

export default {
  PORT: Number(process.env.PORT) || 8080,
  APP_NAME: process.env.APP_NAME,
  NODE_ENV: process.env.NODE_ENV,
  SECRET: process.env.SECRET,
  ENVIRONMENT: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
  IS_LOCAL: process.env.NODE_ENV === 'local',
  STAGING_WEB_APP_URL: 'https://application.honeycombcredit.com',
  PRODUCTION_WEB_APP_URL: 'https://invest.honeycombcredit.com',
  ADMIN_PANEL_LINK: process.env.ADMIN_PANEL_URL
};
