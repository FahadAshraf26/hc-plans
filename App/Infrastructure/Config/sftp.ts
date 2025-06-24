import * as dotenv from 'dotenv';
dotenv.config();

export default {
  HOST: process.env.SFTP_HOST,
  USERNAME: process.env.SFTP_USERNAME,
  PRIVATE_KEY_PATH: process.env.SFTP_PRIVATE_KEY_PATH,
  SFTP_ROOT_NACHA_DIRECTORY: process.env.SFTP_ROOT_NACHA_DIRECTORY,
  SFTP_ROOT_FAIM_DIRECTORY: process.env.SFTP_ROOT_FAIM_DIRECTORY,
}