import * as dotenv from 'dotenv';
dotenv.config();

export default {
  idology: {
    USERNAME: process.env.IDOLOGY_USERNAME,
    PASSWORD: process.env.IDOLOGY_PASSWORD,
  },
};
