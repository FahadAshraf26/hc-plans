import * as dotenv from 'dotenv';
dotenv.config();

export default {
  GOOGLE_APPLICATION_CREDENTIALS: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  BUCKET_NAME: process.env.BUCKET_NAME,
  PRIVATE_BUCKET_NAME: process.env.PRIVATE_BUCKET_NAME,
  PROJECT_ID: process.env.GOOGLE_PROJECT_ID,
  GOOGLE_SERVICE_KEY_FILE:
    process.env.NODE_ENV === 'development'
      ? '/honeycomb-api/honeycomb-staging-key.json'
      : '/honeycomb-api/honeycomb-production-key.json',
  GOOGLE_STORAGE_PATH: process.env.GOOGLE_STORAGE_PATH,
  ROOT_NACHA_DIRECTORY: process.env.GCP_ROOT_NACHA_DIRECTORY,
  ROOT_FAIM_DIRECTORY: process.env.GCP_ROOT_FAIM_DIRECTORY,
  GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
};
