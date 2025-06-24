const EmailVerificationStatus = require('../../../App/Domain/Core/ValueObjects/EmailVerificationStatus');
const InvestorAccreditationStatus = require('../../../App/Domain/Core/ValueObjects/InvestorAccreditationStatus');
const KycStatus = require('../../../App/Domain/Core/ValueObjects/KycStatus');
const moment = require('moment');

const campaign = {
  campaignId: '1',
  campaignName: 'Test Campaign',
  campaignStartDate: moment.utc().add(1, 'm').format('YYYY-MM-DD'),
  campaignStage: 'Fundraising',
  campaignDuratin: 90,
  annualInterestRate: 10,
  issuer: {
    issuerId: '1',
    issuerName: 'Test Issuer',
    issuerEmail: 'test@issuer.com',
  },
  campaignTargetAmount: 10000,
  campaignMinimumAmount: 5000,
};

const user = {
  userId: '1',
  email: 'user@test.com',
  isEmailVerified: EmailVerificationStatus.VERIFIED,
  isVerified: KycStatus.VERIFIED,
  investor: {
    investorId: '1',
    annualIncome: 0,
    netWorth: 0,
    dwollaCustomerId: '1',
    dwollaVerificationStatus: 'verified',
    isAccredired: InvestorAccreditationStatus.NOT_ACCREDITED,
    accreditationExpiryDate: undefined,
  },
};

const investorBank = {
  investorBankId: '1',
  lastFour: '0000',
  dwollaSourceId: '1',
};

const escrowBank = {
  escrowBankId: '1',
  lastFour: '0000',
  dwollaSourceId: '1',
};

const issuerBank = {
  issuerBankId: '1',
  lastFour: '0000',
  dwollaSourceId: '1',
}

const sumAccredited = 0;
const sumNonAccredited = 0;

module.exports = {
  campaign,
  user,
  escrowBank,
  investorBank,
  issuerBank,
  sumAccredited,
  sumNonAccredited,
};
