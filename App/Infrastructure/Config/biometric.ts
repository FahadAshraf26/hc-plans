import * as dotenv from 'dotenv';
dotenv.config();

export default {
  biometric: {
    BIOMETRIC_KEY: process.env.BIOMETRIC_KEY,
  },
};
