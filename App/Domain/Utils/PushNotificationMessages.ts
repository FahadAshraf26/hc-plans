const CampaignComingSoonMessage = {
  title: `@{CAMPAIGN_NAME} is coming soon!`,
  body: `Check out this new investment opportunity: @{CAMPAIGN_NAME}.`,
};
const NewLiveCampaignMessage = {
  title: `@{CAMPAIGN_NAME} is now live`,
  body: `Check out this new investment opportunity: @{CAMPAIGN_NAME}.`,
};
const PaymentReceivedMessage = {
  title: `Payment from @{CAMPAIGN_NAME}`,
  body: `Cha-ching! You received a payment from @{CAMPAIGN_NAME}`,
};
const CampaignIsFundedMessage = {
  title: `@{CAMPAIGN_NAME} funded!`,
  body: `Wooh! @{CAMPAIGN_NAME} has been fully-funded. `,
};
const CampaignFailedMessage = {
  title: `@{CAMPAIGN_NAME} unsuccessful!`,
  body: `Unfortunately @{CAMPAIGN_NAME} did not meet its minimum fundraising goal. You will get a full refund on your investment.`,
};
const LikedCampaignReminder30Days = {
  title: `@{CAMPAIGN_NAME} has 30 days remaining`,
  body: `The investment opportunity, @{CAMPAIGN_NAME}, is about to expire in 30 days.`,
};
const LikedCampaignReminder24Hours = {
  title: `@{CAMPAIGN_NAME} has 24 hours remaining`,
  body: `The investment opportunity, @{CAMPAIGN_NAME}, is about to expire in 24 hours.`,
};
const PersonalDetailsNotProvidedMessage = {
  title: `@{USERNAME} don't forget to add your personal details`,
  body: `Click here to complete your profile information on Miventure.`,
};
const InviteAFriendMessage = {
  title: `Invite your friends`,
  body: `Share the gift of becoming a business investor with a friend`,
};
const InvestmentDefaultedMessage = {
  title: `@{CAMPAIGN_NAME} has defaulted`,
  body: `Unfortunately, one of your investments has gone into default.`,
};
const InvestmentPaidInFullMessage = {
  title: `@{CAMPAIGN_NAME} has paid in full!`,
  body: `Congratulations! One of your investments has paid you in full.`,
};
const IssuerQuestionMessage = {
  title: `@{USERNAME} has asked you a question`,
  body: `You got a question in your Q & A on Miventure.`,
};

const InvestmentCapReachedMessage = {
  title: `You’ve reached your investment cap for now`,
  body: `You’ve reached your investment cap. Please update your investor status to increase your cap, if applicable, or we'll reach out to you when you're able to invest again`,
};

const IdVerifiedMessage = {
  title: `Your ID was verified!`,
  body: `Your ID was verified!`,
};

const InvestmentCapAvailableMessage = {
  title: `You're able to invest again`,
  body: `You now have atleast $100 to invest`,
};

const RepaymentReceivedMessage = {
  title: `Payment from @{CAMPAIGN_NAME}`,
  body: `Cha-ching! You received a payment from @{CAMPAIGN_NAME}`,
};

const BusinessUpdateMessage = {
  title: `Business Update from @{CAMPAIGN_NAME}`,
  body: `@{CAMPAIGN_NAME} has an update in Business News`,
};

const completeSignUpMessage = {
  title: `Complete Sign Up!`,
  body: `We've made sign up easier. Check it out!`,
};

const addBankAccountMessage = {
  title: `Add a Bank Account!`,
  body: `Almost ready to invest! Just add your payment preference.`,
};

const sendFeedbackMessage = {
  title: `Send us Feedback!`,
  body: `We noticed you have not invested. Tell us why!`,
};

const referAFriendMessage = {
  title: `Refer a Friend!`,
  body: `Thanks for investing. Tell a friend!`,
};

const replaceCampaignName = (text?, campaignName?) => {
  return text.replace('@{CAMPAIGN_NAME}', campaignName);
};

const replaceUserName = (text?, userName?) => {
  let textToReplaceWith = 'Hey,';
  if (userName) {
    textToReplaceWith = userName;
  }
  return text.replace('@{USERNAME}', textToReplaceWith);
};

export default {
  CampaignComingSoonMessage,
  NewLiveCampaignMessage,
  PaymentReceivedMessage,
  CampaignIsFundedMessage,
  CampaignFailedMessage,
  LikedCampaignReminder30Days,
  LikedCampaignReminder24Hours,
  PersonalDetailsNotProvidedMessage,
  InviteAFriendMessage,
  InvestmentDefaultedMessage,
  InvestmentPaidInFullMessage,
  IssuerQuestionMessage,
  InvestmentCapReachedMessage,
  InvestmentCapAvailableMessage,
  replaceCampaignName,
  replaceUserName,
  RepaymentReceivedMessage,
  IdVerifiedMessage,
  BusinessUpdateMessage,
  completeSignUpMessage,
  addBankAccountMessage,
  sendFeedbackMessage,
  referAFriendMessage,
};
