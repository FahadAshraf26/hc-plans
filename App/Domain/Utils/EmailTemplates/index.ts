import forgotPasswordTemplate from './forgotPasswordTemplate';
import firstTimePasswordSetTemplate from './firstTimePasswordSetTemplate';
import campaignQATemplate from './campaignQATemplate';
import userSignUpTemplate from './userSignUpTemplate';
import capitalRequestTemplate from './capitalRequestTemplate';
import contactUsTemplate from './contactUsTemplate';
import feedbackTemplate from './feedbackTemplate';
import issuerTransferFailedTemplate from './issuerTransferFailedTemplate';
import resetPasswordTemplate from './resetPasswordTemplate';
import initiateAccreditationTemplate from './InvestReady/initiateAccreditationTemplate';
import accreditationFailedTemplate from './InvestReady/accreditationFailedTemplate';
import investReadyAuthRedirectTemplate from './InvestReady/authRedirectTemplate';
import renewAccreditationTemplate from './InvestReady/renewAccreditationTemplate';
import emailVerificationTemplate from './EmailVerification/emailVerificationTemplate';
import emailVerificationCompleteTemplate from './EmailVerification/emailVerificationCompleteTemplate';
import aboutMiventureTemplate from './aboutMiventureTemplate';
import commitmentReceiptTemplate from './CommitmentReceiptTemplate';
import promoCommitmentReceiptTemplate from './PromoCommitmentReceiptTemplate';
import campaignQAReportAbuseTemplate from './campaignQAReportAbuseTemplate';
import campaignNewsReportAbuseTemplate from './campaignNewsReportAbuseTemplate';
import campaignGoalReachedTemplate from './campaignGoalReachedTemplate';
import campaignMinimumGoalReachedTemplate from './campaignMinimumGoalReachedTemplate';
import campaignHalfMinimumGoalReachedTemplate from './campaignHalfMinimumGoalReachedTemplate';
import campaignTermsChangedTemplate from './campaignTermsChangedTemplate';
import campaignSuccessTemplate from './campaignSuccessTemplate';
import campaignFailedTemplate from './campaignFailedTemplate';
import campaignEarlySuccessTemplate from './campaignEarlySuccessTemplate';
import appFeedbackTemplate from './appFeedbackTemplate';
import IdologyScanTemplate from './IdologyScanTemplate';
import IdologyManualReviewTemplate from './IdologyManualReviewTemplate';
import IdolodyScanApprovedTemplate from './IdolodyScanApprovedTemplate';
import UncaughtExceptionTemplate from './UncaughtExceptionTemplate';
import UserBankUpdatedTemplate from './UserBankUpdatedTemplate';
import IssuerBankUpdatedTemplate from './IssuerBankUpdatedTemplate';
import UserPasswordUpdatedTemplate from './UserPasswordUpdatedTemplate';
import RefundRequestTemplate from './refundRequestTemplate';
import RefundRequestCompletedTemplate from './refundRequestCompletedTemplate';
import documentUploadSampleTemplate from './documentUploadSampleTemplate';
import UsersWithNoInvestmentsDripCampaign from './UsersWithNoInvestmentsDripCampaign';
import paymentOptionRemovedTemplate from './NorthCapital/paymentOptionRemovedTemplate';
import UsersWithKycPassedNoInvestmentDripCampaign from './UsersWithKycPassedNoInvestmentDripCampaign';
import DwollaKYC from './DwollaKYC';
import notifyAdminForAccreditationTemplate from './NorthCapitalWebhook/notifyAdminForAccreditationTemplate';
import repaymentSchedule from './repaymentSchedule';
import emailAlreadyVerifiedTemplate from './EmailVerification/emailAlreadyVerifiedTemplate';
import SomethingWentWrongTemplate from './SomethingWentWrongTemplate';
import OldEmailUpdatedTemplate from './OldEmailUpdatedTemplate';
import ReconfirmOfferingChangesTemplate from './ReconfirmOfferingChangesTemplate';
import emailVerificationLinkExpiredTemplate from './EmailVerification/emailVerificationLinkExpiredTemplate';
import AppleUsersApologyTemplate from './AppleUsersApologyTemplate';
import setNewPasswordTemplate from '@domain/Utils/EmailTemplates/setNewPasswordTemplate';
import userSubmittedIdentityTemplate from '@domain/Utils/EmailTemplates/UserSubmittedIdentityTemplate';
import manualKYCReviewTemplate from '@domain/Utils/EmailTemplates/ManualKYCReviewTemplate';
import NewIssuerInvestmentTemplate from './NewIssuerInvestmentTemplate';
import notePurchaseAgreementTemplate from './NPA/notePurchaseAgreementTemplate';
import WefunderInvestmentTemplate from './WefunderInvestmentTemplate';
import BusinessUpdateTemplate from './BusinessUpdateTemplate';
import HoneycombTradesTemplate from './HoneycombTradesTemplate';
import UploadVoidedCheckTemplate from './UploadVoidedCheckTemplate';
import HybridCommitmentReceiptTemplate from './HybridCommitmentReceiptTemplate';
import PromoHybridCommitmentReceiptTemplate from './PromoHybridCommitmentReceiptTemplate';
import nachaFileUploadEmailTemplate from './nachaFileUploadEmailTemplate';
import uploadRepaymentErrorFileTemplate from './uploadRepaymentErrorFileTemplate';
import updateACHRefundStatusErrorEmailTemplate from './updateACHRefundStatusErrorEmailTemplate';

const {
  DiversifyRobinhoodWithPassiveIncome,
  ForThePeopleByThePeople,
  TrustworthyAndCompliant,
  WhyWeBuiltMiventure,
  CheckOutNewFeaturesOnMiventure,
  HowDoOpportunitiesGetOnMiventure,
  HowDoBusinessesGetOnMiventure,
  AskFounderAQuestion,
  DiversifyYourPortfolio,
  InvestInFounderThatInspiresYou,
  SendYourFeedback,
  WelcomeTOMiventureCommunity,
} = UsersWithNoInvestmentsDripCampaign;
const {
  CongratsOnBecomingEligibleToInvest,
  LifeGetsBusyWeGetIt,
  MiventureWantsToHearFromYou,
} = UsersWithKycPassedNoInvestmentDripCampaign;

const {
  bankTransferFailedTemplate,
  userDocumentApprovedTemplate,
  userDocumentFailedTemplate,
  userDocumentNeededTemplate,
  userRetryTemplate,
  userSuspendedTemplate,
  userVerifiedTemplate,
  userCreatedTemplate,
  customerBankTransferCompletedSenderTemplate,
  customerBankTransferCompletedReceiverTemplate,
  customerBankTransferCompletedInvestorTemplate,
  customerTransferCancelledTemplate,
  customerBankTransferCancelledReceiverTemplate,
  customerBankTransferCancelledSenderTemplate,
  customerBankTransferFailedReceiverTemplate,
  customerBankTransferFailedSenderTemplate,
  customerTransferFailedTemplate,
  customerTransferCreatedSenderTemplate,
  customerTransferCreatedReceiverTemplate,
  customerFundingSourceAddedInvestorTemplate,
  customerFundingSourceAddedIssuerTemplate,
  customerVerificationDocumentUploadedTemplate,
  customerFundingSourceVerifiedIssuerTemplate,
  customerFundingSourceVerifiedInvestorTemplate,
  recurringPaymentScheduledTemplate,
} = DwollaKYC;

const baseTemplate = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link href="https://fonts.cdnfonts.com/css/open-sans" rel="stylesheet">
    <title>Honeycomb</title>
    <style>
      * {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
          Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
      }
    </style>
  </head>
  <body style="font-size: 1rem;max-width: 800px; margin:auto">
    <img
        src="https://storage.googleapis.com/honeycomb-public-uploads/uploads/Honeycomb_Credit_Logo_Admin_Panel.png"
        alt="honeycomb-logo"
        width="200"
        style="display: block; margin-left: auto; margin-right: auto;"
    />
    <div style='{@CONTENT_STYLES}'>
    {@CONTENT}
    </div>
    <br />
    <br />
    <div>
      <p style="border-top: 1px solid #bbb; width: 120px;"></p>
      <p style="color: #bbb;">
        <br />
        Honeycombcredit.com (the "Site") is owned by Honeycomb Credit, Inc. and is used by Honeycomb Portal LLC.
        Honeycomb Portal LLC is registered with the US Securities and Exchange Commission ("SEC") as a funding portal
        ("Portal") and is a member of the Financial Industry Regulatory Authority (FINRA). Honeycomb Portal LLC offers
        crowdfunding campaigns to everyone over 18 years of age under Title III Regulation Crowdfunding.
        Crowdfunding in private companies is particularly risky, illiquid and you should only consider investing if you can
        afford to lose your entire funding amount. Additionally, these crowdfunding campaigns are subject to risks
        associated with the industries in which they operate, which are disclosed in the respective Company's offering
        documents. We do not provide financial advice, make investment recommendations or endorse, warranty or
        guarantee any offering on this Site. Potential business investors must make their own independent investment
        decisions and are strongly encouraged to consult with their independent legal, tax and financial advisors before
        investing. Past performance of a security or a company does not guarantee future results or returns. By using
        this Site, you are subject to our Terms of Use and our Privacy Policy. Neither the SEC nor any state agency has
        reviewed the crowdfunding opportunities listed on the Site.
        © 2025 Honeycomb Credit, Inc. All rights reserved.
      </p>
    </div>
  </body>
</html>
`;

const parseContent = (template, contentStyles = 'padding:1rem;') => {
  return baseTemplate
    .replace('{@CONTENT}', template)
    .replace('{@CONTENT_STYLES}', contentStyles);
};

const parseGlobalContent = (template) => parseContent(template, 'padding: 1rem 0.25rem;');

export default {
  forgotPasswordTemplate: parseContent(forgotPasswordTemplate),
  firstTimePasswordSetTemplate: parseContent(firstTimePasswordSetTemplate),
  userSignUpTemplate: parseContent(userSignUpTemplate),
  capitalRequestTemplate: parseContent(capitalRequestTemplate),
  contactUsTemplate: parseContent(contactUsTemplate),
  feedbackTemplate: parseContent(feedbackTemplate),
  issuerTransferFailedTemplate: parseContent(issuerTransferFailedTemplate),
  resetPasswordTemplate: resetPasswordTemplate,
  setNewPasswordTemplate: setNewPasswordTemplate,
  initiateAccreditationTemplate: parseContent(initiateAccreditationTemplate),
  accreditationFailedTemplate: parseContent(accreditationFailedTemplate),
  investReadyAuthRedirectTemplate: investReadyAuthRedirectTemplate,
  renewAccreditationTemplate: parseContent(renewAccreditationTemplate),
  emailVerificationTemplate: parseContent(emailVerificationTemplate),
  emailVerificationCompleteTemplate: emailVerificationCompleteTemplate,
  aboutMiventureTemplate: parseContent(aboutMiventureTemplate),
  commitmentReceiptTemplate: commitmentReceiptTemplate,
  promoCommitmentReceiptTemplate: promoCommitmentReceiptTemplate,
  hybridCommitmentReceiptTemplate: HybridCommitmentReceiptTemplate,
  promoHybridCommitmentReceiptTemplate: PromoHybridCommitmentReceiptTemplate,
  campaignQAReportAbuseTemplate: parseContent(campaignQAReportAbuseTemplate),
  campaignGoalReachedTemplate: parseContent(campaignGoalReachedTemplate),
  campaignMinimumGoalReachedTemplate: parseContent(campaignMinimumGoalReachedTemplate),
  campaignHalfMinimumGoalReachedTemplate: parseContent(
    campaignHalfMinimumGoalReachedTemplate,
  ),
  campaignTermsChangedTemplate: parseContent(campaignTermsChangedTemplate),
  campaignSuccessTemplate: parseContent(campaignSuccessTemplate),
  campaignEarlySuccessTemplate: parseContent(campaignEarlySuccessTemplate),
  campaignFailedTemplate: parseContent(campaignFailedTemplate),
  appFeedbackTemplate: parseContent(appFeedbackTemplate),
  IdologyScanTemplate: parseContent(IdologyScanTemplate),
  IdologyManualReviewTemplate: parseContent(IdologyManualReviewTemplate),
  IdolodyScanApprovedTemplate: parseContent(IdolodyScanApprovedTemplate),
  UncaughtExceptionTemplate: parseContent(UncaughtExceptionTemplate),
  UserPasswordUpdatedTemplate: parseContent(UserPasswordUpdatedTemplate),
  UserBankUpdatedTemplate: parseContent(UserBankUpdatedTemplate),
  IssuerBankUpdatedTemplate: parseContent(IssuerBankUpdatedTemplate),
  bankTransferFailedTemplate: parseContent(bankTransferFailedTemplate),
  userDocumentApprovedTemplate: parseContent(userDocumentApprovedTemplate),
  userDocumentFailedTemplate: parseContent(userDocumentFailedTemplate),
  userDocumentNeededTemplate: parseContent(userDocumentNeededTemplate),
  userRetryTemplate: parseContent(userRetryTemplate),
  userSuspendedTemplate: parseContent(userSuspendedTemplate),
  userVerifiedTemplate: parseContent(userVerifiedTemplate),
  userCreatedTemplate: parseContent(userCreatedTemplate),
  customerBankTransferCompletedSenderTemplate: parseContent(
    customerBankTransferCompletedSenderTemplate,
  ),
  customerBankTransferCompletedReceiverTemplate: parseContent(
    customerBankTransferCompletedReceiverTemplate,
  ),
  customerBankTransferCompletedInvestorTemplate: parseContent(
    customerBankTransferCompletedInvestorTemplate,
  ),
  customerTransferCancelledTemplate: parseContent(customerTransferCancelledTemplate),
  customerBankTransferCancelledReceiverTemplate: parseContent(
    customerBankTransferCancelledReceiverTemplate,
  ),
  customerBankTransferCancelledSenderTemplate: parseContent(
    customerBankTransferCancelledSenderTemplate,
  ),
  customerBankTransferFailedReceiverTemplate: parseContent(
    customerBankTransferFailedReceiverTemplate,
  ),
  customerBankTransferFailedSenderTemplate: parseContent(
    customerBankTransferFailedSenderTemplate,
  ),
  customerTransferFailedTemplate: parseContent(customerTransferFailedTemplate),
  campaignNewsReportAbuseTemplate: parseContent(campaignNewsReportAbuseTemplate),
  customerTransferCreatedSenderTemplate: parseContent(
    customerTransferCreatedSenderTemplate,
  ),
  customerTransferCreatedReceiverTemplate: parseContent(
    customerTransferCreatedReceiverTemplate,
  ),
  customerFundingSourceAddedInvestorTemplate: parseContent(
    customerFundingSourceAddedInvestorTemplate,
  ),
  customerFundingSourceAddedIssuerTemplate: parseContent(
    customerFundingSourceAddedIssuerTemplate,
  ),
  customerVerificationDocumentUploadedTemplate: parseContent(
    customerVerificationDocumentUploadedTemplate,
  ),
  customerFundingSourceVerifiedIssuerTemplate: parseContent(
    customerFundingSourceVerifiedIssuerTemplate,
  ),
  customerFundingSourceVerifiedInvestorTemplate: parseContent(
    customerFundingSourceVerifiedInvestorTemplate,
  ),
  recurringPaymentScheduledTemplate: parseContent(recurringPaymentScheduledTemplate),
  refundRequestTemplate: parseContent(RefundRequestTemplate),
  refundRequestCompletedTemplate: parseContent(RefundRequestCompletedTemplate),
  campaignQATemplate: parseContent(campaignQATemplate),
  nachaFileUploadEmailTemplate: parseContent(nachaFileUploadEmailTemplate),
  repaymentSchedule: repaymentSchedule,
  emailAlreadyVerifiedTemplate: emailAlreadyVerifiedTemplate,
  SomethingWentWrongTemplate: SomethingWentWrongTemplate,
  OldEmailUpdatedTemplate: OldEmailUpdatedTemplate,
  ReconfirmOfferingChangesTemplate: ReconfirmOfferingChangesTemplate,
  emailVerificationLinkExpiredTemplate: emailVerificationLinkExpiredTemplate,
  parseContent,
  parseGlobalContent,
  DiversifyRobinhoodWithPassiveIncome: parseContent(DiversifyRobinhoodWithPassiveIncome),
  AskFounderAQuestion: parseContent(AskFounderAQuestion),
  HowDoBusinessesGetOnMiventure: parseContent(HowDoBusinessesGetOnMiventure),
  DiversifyYourPortfolio: parseContent(DiversifyYourPortfolio),
  InvestInFounderThatInspiresYou: parseContent(InvestInFounderThatInspiresYou),
  SendYourFeedback: parseContent(SendYourFeedback),
  WelcomeTOMiventureCommunity: parseContent(WelcomeTOMiventureCommunity),
  notifyAdminForAccreditationTemplate: notifyAdminForAccreditationTemplate,
  ForThePeopleByThePeople: parseContent(ForThePeopleByThePeople),
  TrustworthyAndCompliant: parseContent(TrustworthyAndCompliant),
  WhyWeBuiltMiventure: parseContent(WhyWeBuiltMiventure),
  HowDoOpportunitiesGetOnMiventure: parseContent(HowDoOpportunitiesGetOnMiventure),
  CheckOutNewFeaturesOnMiventure: parseContent(CheckOutNewFeaturesOnMiventure),
  CongratsOnBecomingEligibleToInvest: parseContent(CongratsOnBecomingEligibleToInvest),
  LifeGetsBusyWeGetIt: parseContent(LifeGetsBusyWeGetIt),
  MiventureWantsToHearFromYou: parseContent(MiventureWantsToHearFromYou),
  AppleUsersApologyTemplate: parseContent(AppleUsersApologyTemplate),
  DocumentUploadSampleTemplate: parseContent(documentUploadSampleTemplate),
  paymentOptionRemovedTemplate: parseContent(paymentOptionRemovedTemplate),
  userSubmittedIdentityTemplate: parseContent(userSubmittedIdentityTemplate),
  manualKYCReviewTemplate: parseContent(manualKYCReviewTemplate),
  newIssuerInvestmentTemplate: parseContent(NewIssuerInvestmentTemplate),
  notePurchaseAgreementTemplate: parseContent(notePurchaseAgreementTemplate),
  wefunderInvestmentTemplate: parseContent(WefunderInvestmentTemplate),
  businessUpdateTemplate: parseContent(BusinessUpdateTemplate),
  honeycombTradesTemplate: parseContent(HoneycombTradesTemplate),
  uploadVoidedCheckTemplate: parseContent(UploadVoidedCheckTemplate),
  uploadRepaymentErrorFileTemplate: parseContent(uploadRepaymentErrorFileTemplate),
  updateACHRefundStatusErrorEmailTemplate: parseContent(
    updateACHRefundStatusErrorEmailTemplate,
  ),
};
