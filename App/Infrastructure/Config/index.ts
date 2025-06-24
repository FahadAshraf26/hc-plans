import path from 'path';
import database from './database';
import server from './server';
import idology from './idology';
import dwolla from './dwolla';
import emailConfig from './email';
import encryption from './encryption';
import investReady from './investReady';
import google from './google';
import authConfig from './auth';
import northCapital from './northCapital';
import formSite from './formsite';
import slackConfig from './slack';
import moneyMadeConfig from './moneyMade';
import usaepay from './usaepay';
import stripe from './stripe';
import recaptcha from './recaptcha';
import loanwell from './loanwell';
import biometric from './biometric';
import firebase from './firebase';
import asanaConfig from './asana';
import nachaConfig from './nacha';
import SFTPConfig from './sftp';
import threadBankConfig from './threadBank';

const storagePath = path.resolve(__dirname, '../../../storage/');

export default {
  database,
  server,
  idology,
  dwolla,
  emailConfig,
  encryption,
  investReady,
  google,
  authConfig,
  northCapital,
  formSite,
  slackConfig,
  moneyMadeConfig,
  storagePath,
  usaepay,
  stripe,
  recaptcha,
  loanwell,
  biometric,
  firebase,
  asanaConfig,
  nachaConfig,
  SFTPConfig,
  threadBankConfig,
};
