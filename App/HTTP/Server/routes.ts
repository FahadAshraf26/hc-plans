import express from 'express';
import globalErrorHandler from '../Middleware/globalErrorMiddleware';
import app from './bootstrap';
import userRoutes from '../Routes/userRoutes';
import authRoutes from '../Routes/authRoutes';
import invitationRoutes from '../Routes/invitationRoutes';
import IssuerCampaignRoutes from '../Routes/IssuerCampaignRoutes';
import tagRoutes from '../Routes/tagRoutes';
import TagCategoryRoutes from '../Routes/TagCategoryRoutes';
import IssuerRoutes from '../Routes/IssuerRoutes';
import IssuerOwnerRoutes from '../Routes/IssuerOwnerRoutes';
import CampaignsRoutes from '../Routes/CampaignsRoutes';
import InvestorRoutes from '../Routes/InvestorRoutes';
import CapitalRequestRoutes from '../Routes/CapitalRequestRoutes';
import AdminRoutes from '../Routes/AdminRoutes';
import WebhookRoutes from '../Routes/WebhookRoutes';
import NAICRoutes from '../Routes/NAICRoutes';
import AuthController from '../Controllers/AuthController';
import InvestReadyController from '../Controllers/InvestReadyController';
import tosRoutes from '../Routes/tosRoutes';
import MediaController from '../Controllers/MediaController';
import updateRoutes from '../Routes/UpdateRoutes';
import PlaidRoutes from '../Routes/PlaidRoutes';
import container from '../../Infrastructure/DIContainer/container';
import makeExpressCallback from '../Utils/makeExpressCallback';
import campaignOfferingChangeRoutes from '../Routes/CampaignOfferingChangeRoutes';
import globalHoneycombConfigurationRoute from '../Routes/GlobalHoneycombConfigurationRoute';
import repaymentsRoute from '../Routes/RepaymentsRoutes';
import investorPaymentsRoute from '../Routes/InvestorPaymentsRoute';
import projectionReturnsRoute from '../Routes/ProjectionReturnsRoute';
import packageJson from '../../../package.json';
import HoneycombDwollaConsentRoutes from '../Routes/HoneycombDwollaConsentRoutes';
import signedUrlRoutes from '../Routes/SignedUrlRoutes';
import honeycombDwollaBeneficialOwnerRoutes from '../Routes/HoneycombDwollaBeneficialOwnerRoutes';
import honeycombDwollaOnDemandAuthorizationRoutes from '../Routes/HoneycombDwollaOnDemandAuthorizationRoutes';
import dwollaFundingSourceVerificationRoutes from '../Routes/DwollaFundingSourceVerificationRoutes';
import dwollaBusinessClassificationRoutes from '../Routes/DwollaBusinessClassificationRoutes';
import honeycombDwollaCustomerRoutes from '../Routes/HoneycombDwollaCustomerRoutes';
import dwollaBalanceRoutes from '../Routes/DwollaBalanceRoutes';
import dwollaPreTransactionRoutes from '../Routes/DwollaPreTransactionsRoutes';
import dwollaPreBankTransactionsRoutes from '../Routes/DwollaPreBankTransactionsRoute';
import dwollaToBankTransactionsRoute from '../Routes/DwollaToBankTransactionsRoute';
import dwollaPostTransactionsRoute from '../Routes/DwollaPostTransactionsRoute';
import dwollaPostBankTransactionsRoute from '../Routes/DwollaPostBankTransactionsRoute';
import exportDataRoute from '../Routes/ExportDataRoute';
import northCapitalDocumentRoute from '../Routes/NorthCapitalDocumentRoutes';
import UserTransactionHistoryRoute from '../Routes/UserTransactionHistoryRoute';
import ExportEducationalData from '../Routes/ExportEducationalData';
import siteBannerConfigurationRoute from '../Routes/SiteBannerConfigurationRoute';
import fcDwollaTransactionsRoute from '../Routes/FCDwollaTransactionsRoute';
import loanwellRoute from '../Routes/LoanwellRoutes';
import dwollaCustodyTransactions from '../Routes/DwollaCustodyTransactionRoute';
import dwollaCustodyTransferHistoryController from '../Routes/DwollaCustodyTransferHistoryRoute';
import promotionTextRoute from '../Routes/PromotionTextRoute';
import userTagPreferenceRoute from '../Routes/UserTagPreferenceRoutes';

const authController = container.get<AuthController>(AuthController);
const investReadyController = container.get<InvestReadyController>(InvestReadyController);
const mediaController = container.get<MediaController>(MediaController);

const apiVersion = '/api/v1';

app.use(`${apiVersion}/uploads/`, express.static('uploads'));

app.use(`${apiVersion}/users`, userRoutes);

app.use(`${apiVersion}/users`, authRoutes);
app.use(`${apiVersion}/admins`, AdminRoutes);

app.use(`${apiVersion}/investors`, InvestorRoutes);
app.use(`${apiVersion}/users/:initiator/invitations`, invitationRoutes);
app.use(`${apiVersion}/issuers/:issuerId/campaigns`, IssuerCampaignRoutes);
app.use(`${apiVersion}/campaigns`, CampaignsRoutes);
app.use(`${apiVersion}/issuers`, IssuerRoutes);
app.use(`${apiVersion}/owners/:ownerId/issuers`, IssuerOwnerRoutes);
app.use(`${apiVersion}/tags`, tagRoutes);
app.use(`${apiVersion}/tagCategories`, TagCategoryRoutes);
app.use(`${apiVersion}/naic`, NAICRoutes);
app.use(`${apiVersion}/capitalRequests`, CapitalRequestRoutes);
app.use(`${apiVersion}/webhooks`, WebhookRoutes);
app.use(`${apiVersion}/tos`, tosRoutes);
app.use(`${apiVersion}/updates`, updateRoutes);
app.use(`${apiVersion}/offerings`, campaignOfferingChangeRoutes);
app.use(`${apiVersion}/plaid`, PlaidRoutes);
app.use(`${apiVersion}/globalHoneycombConfiguration`, globalHoneycombConfigurationRoute);
app.use(`${apiVersion}/repayments`, repaymentsRoute);
app.use(`${apiVersion}/investorPayments`, investorPaymentsRoute);
app.use(`${apiVersion}/projectionReturns`, projectionReturnsRoute);
app.use(`${apiVersion}/dwollaConsent`, HoneycombDwollaConsentRoutes);
app.use(`${apiVersion}/signedUrl`, signedUrlRoutes);
app.use(`${apiVersion}/dwollaBeneficialOwner`, honeycombDwollaBeneficialOwnerRoutes);
app.use(
  `${apiVersion}/onDemandAuthorization`,
  honeycombDwollaOnDemandAuthorizationRoutes,
);
app.use(
  `${apiVersion}/dwollaFundingSourceVerification`,
  dwollaFundingSourceVerificationRoutes,
);
app.use(`${apiVersion}/dwollaBusinessClassification`, dwollaBusinessClassificationRoutes);
app.use(`${apiVersion}/dwollaCustomer`, honeycombDwollaCustomerRoutes);
app.use(`${apiVersion}/balance`, dwollaBalanceRoutes);
app.use(`${apiVersion}/dwollaPreTransactions`, dwollaPreTransactionRoutes);
app.use(`${apiVersion}/dwollaPreBankTransactions`, dwollaPreBankTransactionsRoutes);
app.use(`${apiVersion}/dwollaToBankTransactions`, dwollaToBankTransactionsRoute);
app.use(`${apiVersion}/fcDwollaTransactions`, fcDwollaTransactionsRoute);
app.use(`${apiVersion}/dwollaPostTransactions`, dwollaPostTransactionsRoute);
app.use(`${apiVersion}/dwollaPostBankTransactions`, dwollaPostBankTransactionsRoute);
app.use(`${apiVersion}/exportData`, exportDataRoute);
app.use(`${apiVersion}/ncDocuments`, northCapitalDocumentRoute);
app.use(`${apiVersion}/userTransactionHistory`, UserTransactionHistoryRoute);
app.use(`${apiVersion}/exportEducationalData`, ExportEducationalData);
app.use(`${apiVersion}/siteBannerConfiguration`, siteBannerConfigurationRoute);
app.use(`${apiVersion}/loanwell`, loanwellRoute);
app.use(`${apiVersion}/dwollaCustodyTransactions`, dwollaCustodyTransactions);
app.use(
  `${apiVersion}/dwollaCustodyTransferHistory`,
  dwollaCustodyTransferHistoryController,
);
app.use(`${apiVersion}/promotionTexts`, promotionTextRoute);
app.use(`${apiVersion}/userTagPreference`, userTagPreferenceRoute);

app.get(`${apiVersion}/resetPassword`, makeExpressCallback(authController.resetPassword));
app.get(`${apiVersion}/setPassword`, makeExpressCallback(authController.setNewPassword));
app.get(
  `${apiVersion}/investReady/redirect`,
  makeExpressCallback(investReadyController.handleAuthRedirect),
);

app.get(`${apiVersion}/media/:mediaDir/:mediaPath?`, mediaController.serveMedia);

app.get('/ping', (_, res) => {
  res.status(200).json({ ping: 'pong' });
});

app.get('/version', (_, res) => {
  res.status(200).json({
    releaseVersion: packageJson.version,
  });
});

app.use('*', (req, res) => {
  return res.status(404).json({
    status: 'error',
    message: 'not found',
  });
});

app.use(globalErrorHandler);
