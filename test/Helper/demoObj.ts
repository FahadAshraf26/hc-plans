const KycStatus = require('../../App/Domain/Core/ValueObjects/KycStatus');
const InvestorAccreditationStatus = require('../../App/Domain/Core/ValueObjects/InvestorAccreditationStatus');
const InvestorInvestmentType = require('../../App/Domain/Core/ValueObjects/InvestorInvestmentType');
const ChargeStatus = require('../../App/Domain/Core/ValueObjects/ChargeStatus');
const ChargeType = require('../../App/Domain/Core/ValueObjects/ChargeType');
const EmailVerificationStatus = require('../../App/Domain/Core/ValueObjects/EmailVerificationStatus');

const userObj = {
  userId: 'bb5b1c60-f96e-11e9-872a-03cdfe542132',
  firstName: 'test',
  lastName: 'Johnson',
  userName: 'kevin12',
  email: 'kevin1@test.com',
  password: '123456789',
  address: 'US',
  state: 'New York',
  zipCode: '10001',
  dob: '1990-11-14',
  phoneNumber: '(202)555-0198',
  role: '',
  facebook: 'https://www.facebook.com/',
  linkedIn: 'https://www.linkedin.com/login',
  twitter: 'https://twitter.com/',
  instagram: 'https://www.instagram.com/',
  detailSubmittedDate: ' 2020-05-20',
  isVerified: KycStatus.PASS,
  isEmailVerified: EmailVerificationStatus.VERIFIED,
};

const profilePicObj = {
  profilePicId: 'ddd535ct-1222ed-ff55-03erb564f',
  name: 'ownerPic',
  path: 'path string of pic',
  mimeType: 'png',
  userId: 'bb5b1c60-f96e-11e9-872a-03cdfe542132',
};

const ownerObj = {
  ownerId: 'fdf535tc-1872da-ffe5-03erd524e',
  userId: 'bb5b1c60-f96e-11e9-872a-03cdfe542132',
  title: 'Fahad',
  subTitle: 'CEO',
  description: 'Owner of business description',
  primaryOwner: true,
  beneficialOwner: false,
};

const investorObj = {
  investorId: 'db5b1a66-f96a-11c9-872e-13cdfe5423q',
  userId: 'bb5b1c60-f96e-11e9-872a-03cdfe542132',
  annualIncome: 50000,
  netWorth: 50000,
  incomeVerificationTriggered: true,
  investingAvailable: 20,
  isAccredited: InvestorAccreditationStatus.NOT_ACCREDITED,
  investmentCap: 0,
  accreditationExpiryDate: null,
};

const issuerObj = {
  issuerId: 'wt5g1s63-d96c-11a9-872x-08edfa542167',
  issuerName: 'Mint &  Dry',
  physicalAddress: '2312 31 Drive, Orlando, FL 32789',
  dateOfFormation: '2020-02-11',
  website: 'https://www.miventure.com/',
  businessType: 'Laundromat',
  legalEntityType: 'FL',
  organization: 'Orlando',
  description:
    'Mint & Dry is raising funds to open a 2nd unattended, self-service coin laundromat with 24 washer machines and 30 dryers. This small business is located in the heart of downtown Orlando and is in walking distance from many local apartment buildings.  ',
  currentFundRaiseCapacityAvailable: 50000,
  NAIC: 2023423,
  issuerStatus: 'Fundraising',
  fundRaisePurpose: 'Start a New Business',
  email: 'business@test.com',
  facebook: 'https://www.facebook.com/',
  linkedIn: 'https://www.linkedin.com/login',
  twitter: 'https://twitter.com/',
  instagram: 'https://www.instagram.com/',
  pinterest: 'https://www.pinterest.com/',
  reddit: 'https://www.reddit.com/',
  ownerIds: ['fdf535tc-1872da-ffe5-03erd524e'],
  naicId: 1,
};

const issuerOwnerObj = {
  issuerOwnerId: 'bb5b1c60-f96e-11e9-872a-01cffe542777',
  ownerId: ['fdf535tc-1872da-ffe5-03erd524e'],
  issuerId: 'wt5g1s63-d96c-11a9-872x-08edfa542167',
};

const tagObj = {
  tagId: 'eb5b1a66-f96a-11c9-872e-13cdfe5463e',
  tag: 'test',
};

const campaignObj = {
  campaignId: 'fd5b1a26-f96w-11a9-872z-13udfi5463q',
  campaignName: 'test',
  issuerId: 'wt5g1s63-d96c-11a9-872x-08edfa542167',
  campaignExpirationDate: '12-12-12',
  campaignStartDate: new Date().toISOString(),
  campaignDuration: 120,
  campaignStage: 'Fundraising',
  campaignTargetAmount: 10000,
  campaignMinimumAmount: 5000,
  investmentType: 'SAFEEscrow',
  overSubscriptionAccepted: true,
  useOfProceeds: 'test',
  salesLead: 'test',
};

const campaignMediaObj = {
  campaignMediaId: 'd8e281f4-5eeb-11ea-b13d-fb37790ee275',
  campaignId: 'fd5b1a26-f96w-11a9-872z-13udfi5463q',
  name: 'test',
  path: 'test',
  mimeType: 'png',
};

const favoriteCampaignObj = {
  favoriteCampaignId: 'fb5b1e26-f96a-11e9-872w-13sdfi5463t',
  campaignId: 'fd5b1a26-f96w-11a9-872z-13udfi5463q',
  investorId: 'db5b1a66-f96a-11c9-872e-13cdfe5423q',
};
const campaignTagObj = {
  campaignTagId: 'pt5b1e26-p96a-11o9-872k-13sdfl5463j',
  campaignId: 'fd5b1a26-f96w-11a9-872z-13udfi5463q',
  tagId: 'eb5b1a66-f96a-11c9-872e-13cdfe5463e',
};
const campaignTagObj1 = {
  campaignTagId: 'pt5b1e26-p96a-11o9-872k-13sdfl5463j',
  campaignId: 'fd5b1a26-f96w-11a9-872z-13udfi5463q',
  tagId: 'eb5b1a66-f96a-11c9-872e-13cdfe5463e',
};

const campaignRiskObj = {
  campaignRiskId: 'fa5c1a66-f96a-11c9-872e-13cdfe6474f',
  campaignId: 'fd5b1a26-f96w-11a9-872z-13udfi5463q',
  title: 'risk title',
  description: 'risk description',
};

const campaignNotesObj = {
  campaignNotesId: 'fb5c1e66-f96c-11e9-872a-13cdfw6472f',
  campaignId: 'fd5b1a26-f96w-11a9-872z-13udfi5463q',
  notes: 'first note',
};

const invitationObj = {
  invitationId: 'eb5b1a66-f96a-11c9-872e-13cdfe6474f',
  initiator: 'bb5b1c60-f96e-11e9-872a-03cdfe542132',
  invitee: 'hello@gmail.com',
};

const campaignNewsObj = {
  campaignNewsId: 'fc5b1a26-p96e-31p9-872k-13sdfl5763q',
  campaignId: 'fd5b1a26-f96w-11a9-872z-13udfi5463q',
  title: 'test',
  description: 'test',
};

const campaignNewsMediaObj = {
  campaignNewsMediaId: 'db5b1g26-c96a-31q9-872x-15adfl5793w',
  campaignNewsId: 'fc5b1a26-p96e-31p9-872k-13sdfl5763q',
  path: 'test',
  mimeType: 'png',
};
const campaignInfoObj = {
  campaignInfoId: 'cb7b3g90-b96s-64a9-872x-15bcfh5793e',
  financialHistory: '["test"]',
  competitors: 'test',
  campaignId: 'fd5b1a26-f96w-11a9-872z-13udfi5463q',
  milestones: 'test',
  investorPitch: 'test',
  risks: 'test',
};

const campaignQAObj = {
  campaignQAId: 'eb5b1a66-f96a-11c9-872e-13cdfe5463e',
  campaignId: 'fd5b1a26-f96w-11a9-872z-13udfi5463q',
  userId: 'bb5b1c60-f96e-11e9-872a-03cdfe542132',
  type: '',
  text: '',
};

const campaignDocumentObj = {
  campaignDocumentId: 'eb5b1a66-f96a-11c9-872e-24bqra5585g',
  campaignId: 'fd5b1a26-f96w-11a9-872z-13udfi5463q',
  documentType: 'test',
  name: 'test',
  path: 'test',
  mimeType: 'test',
};

const adminRoleObj = {
  adminRoleId: 'fa6c2b77-f96a-11c9-872e-24bqra5585g',
  name: 'super admin',
};

const adminUserObj = {
  adminUserId: 'gb7d4f88-a13j-11c9-872e-24bqra5585g',
  adminRoleId: 'fa6c2b77-f96a-11c9-872e-24bqra5585g',
  name: 'admin',
  email: 'admin@admin.com',
  password: 'admin@miventure',
};

const campaignEscrowBankObj = {
  campaignEscrowBankId: 'dd0e8670-849d-11ea-ae52-83de99753bf1',
  routingNumber: '222222226',
  accountNumber: '123456789',
  subAccountNumber: '123456789',
  status: 'success',
  dwollaSourceId: '93643f0c-6b03-4579-9a8f-d67d572437b1',
  emailContact: 'fahad.ashraf@carbonteq.com',
};

const naicObj = {
  naicId: '1',
  code: '5432',
  title: 'issuer naic',
};
const issuerDocumentObj = {
  issuerDocumentId: 'eb5b1a66-f96a-11c9-872a-24bqra5585g',
  issuerId: 'wt5g1s63-d96c-11a9-872x-08edfa542167',
  documentType: 'test',
  name: 'test',
  path: 'test',
  mimeType: 'test',
  ext: 'test',
};

const userDocumentObj = {
  userDocumentId: 'eb5b1a66-f96a-11c9-872a-24bqra5585g',
  userId: 'bb5b1c60-f96e-11e9-872a-03cdfe542132',
  documentType: 'test',
  name: 'test',
  path: 'test',
  mimeType: 'test',
  ext: 'test',
};

const campaignQAReportObj = {
  campaignQAReportId: '1',
  campaignQAId: campaignQAObj.campaignQAId,
  userId: userObj.userId,
  text: 'this is a report',
};

const tosObj = {
  tosId: 'eb5b1a66-f96a-11c9-872e-13cdfe5463e',
  termOfServicesUpdateDate: false,
  privacyPolicyUpdateDate: false,
  educationalMaterialUpdateDate: false,
  faqsUpdateDate: false,
  createdAt: '2021-04-08',
  updatedAt: '2021-04-08',
};

const chargeObj = {
  chargeId: 'abf72e10-855c-11ea-8322-91945b7da8e9',
  chargeType: ChargeType.TRANSFER,
  dwollaChargeId: 'a4cb5eaa-5c85-ea11-8123-97367568e0f6',
  chargeStatus: ChargeStatus.PENDING,
};

const campaignFundObj = {
  campaignFundId: 'eb5b1a66-f96a-11c9-872e-13cdfe54631',
  amount: '100',
  investorId: investorObj.investorId,
  investorAccreditationStatus: InvestorAccreditationStatus.ACCREDITED,
  investorAnnualIncome: investorObj.annualIncome,
  investorNetWorth: investorObj.netWorth,
  investmentType: InvestorInvestmentType.REG_CF,
  campaignId: campaignObj.campaignId,
  intermediatoryCharge: {
    campaignFundIntermediatoryChargeId: 'eb5b1a66-f96a-11c9-872e-13cdfe54641',
    campaignFundId: 'eb5b1a66-f96a-11c9-872e-13cdfe54631',
    amount: '100',
    chargeId: chargeObj.chargeId,
    charge: chargeObj,
  },
  finalCharges: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

const campaignFundFinalCharge = {
  campaignFundFinalChargeId: 'eb5b1a66-f96a-11c9-872e-13cdfe6789',
  campaignFundId: 'eb5b1a66-f96a-11c9-872e-13cdfe54631',
  amount: '100',
  chargeId: chargeObj.chargeId,
  charge: chargeObj,
};

const campaignNewsReportObj = {
  campaignNewsReportId: '1',
  campaignNewsId: campaignQAObj.campaignQAId,
  userId: userObj.userId,
  text: 'this is a report',
};

const releaseObj = {
  releaseId: 'eb5b1a66-f96a-11c9-872e-13cdfe6789',
  version: '10.10.10',
  action: 'recommended',
  description: 'This is description',
};

module.exports = {
  userObj,
  profilePicObj,
  ownerObj,
  issuerObj,
  issuerOwnerObj,
  investorObj,
  tagObj,
  campaignObj,
  campaignTagObj,
  favoriteCampaignObj,
  campaignNewsObj,
  campaignNewsMediaObj,
  campaignRiskObj,
  invitationObj,
  campaignInfoObj,
  campaignQAObj,
  campaignDocumentObj,
  campaignMediaObj,
  campaignTagObj1,
  adminRoleObj,
  adminUserObj,
  campaignNotesObj,
  campaignEscrowBankObj,
  naicObj,
  userDocumentObj,
  issuerDocumentObj,
  campaignQAReportObj,
  tosObj,
  chargeObj,
  campaignFundObj,
  campaignNewsReportObj,
  campaignFundFinalCharge,
  releaseObj,
};
