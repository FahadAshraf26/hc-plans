import express from 'express';
import auth from '../Middleware/auth';
import adminAuth from '../Middleware/adminAuth';

const router = express.Router();
import UserController from '../Controllers/UserController';
import TosController from '../Controllers/ToSController';
import InvestorBankRoutes from './InvestorBankRoutes';
import UserDocumentRoutes from './UserDocumentRoutes';
import UploadImage from '../Middleware/UploadImage';
import UploadPrivateImage from '../Middleware/UploadPrivateImage';
import CampaignController from '@controller/CampaignController';
import UserNotification from './userNotificationRoutes';
import UserAppFeedbackRoutes from './UserAppFeedbackRoutes';
import UserMediaRoutes from './UserMediaRoutes';
import UserEventRoutes from './UserEventRoutes';
import UncaughtExceptionRoutes from './UncaughtExceptionRoutes';
import UserMutationValidator from '../Middleware/Validators/User/UserMutationValidator';
import UserIssuesRoutes from './UserIssuesRoutes';
import makeExpressCallback from '../Utils/makeExpressCallback';
import container from '../../Infrastructure/DIContainer/container';
import DwollaToBankTransactionsController from '@http/Controllers/DwollaToBankTransactionsController';
import CampaignNotificationController from '@http/Controllers/CampaignNotificationController';
import InvestorCardRoute from './InvestorCardsRoutes';

const userController = container.get<UserController>(UserController);
const tosController = container.get<TosController>(TosController);
const campaignController = container.get<CampaignController>(CampaignController);
const dwollaToBankTransactionsController = container.get<
  DwollaToBankTransactionsController
>(DwollaToBankTransactionsController);
const campaignNotificationController = container.get<CampaignNotificationController>(
  CampaignNotificationController,
);
// const multipleUpload = UploadImage.fields([
//   { name: 'frontUserIdentity', maxCount: 1 },
//   { name: 'backUserIdentity', maxCount: 2 },
// ]);
router.post(
  '/',
  UserMutationValidator,
  UploadImage.single('profilePic'),
  makeExpressCallback(userController.createUser),
);

router.get('/investments', adminAuth, makeExpressCallback(userController.getUsersInvestments))
router.get('/me', auth, makeExpressCallback(userController.getCurrentUser));
router.get('/summary', adminAuth, makeExpressCallback(userController.getSummary));
router.get(
  '/summary/emails',
  adminAuth,
  makeExpressCallback(userController.getUsersEmail),
);
router.post(
  '/uploadId',
  UploadImage.fields([
    { name: 'frontUserIdentity', maxCount: 1 },
    { name: 'backUserIdentity', maxCount: 1 },
    { name: 'documentType', maxCount: 1 }
  ]),
  auth,
  makeExpressCallback(userController.uploadUserId)
);

router.post(
  '/uploadVoidedCheck',
  UploadImage.single('voidedCheck'),
  auth,
  makeExpressCallback(userController.updaloadVoidedCheck),
);

router.get('/', adminAuth, makeExpressCallback(userController.getAllUsers));
router.get('/allData', adminAuth, makeExpressCallback(userController.getUserDataExport));
router.post(
  '/notifications/sendGlobalNotification',
  adminAuth,
  makeExpressCallback(userController.sendGlobalNotification),
);

router.put(
  '/:userId',
  auth,
  UserMutationValidator,
  UploadImage.single('profilePic'),
  makeExpressCallback(userController.updateProfile),
);
router.put(
  '/:userId/profilePicture',
  auth,
  UploadImage.single('profilePic'),
  makeExpressCallback(userController.updateProfilePicture),
);
router.put(
  '/:userId/updateCredentials',
  auth,
  makeExpressCallback(userController.updateUserEmailOrPassword),
);
router.put(
  '/:userId/updateFcmToken',
  auth,
  makeExpressCallback(userController.updateFcmToken),
);
router.put(
  '/:userId/updateBiometricInfo',
  auth,
  makeExpressCallback(userController.updateBiometricInfo),
);
router.get('/:userId', auth, makeExpressCallback(userController.getUser));
router.get('/:userId/info', adminAuth, makeExpressCallback(userController.getUserInfo));

// prompt checks
router.post(
  '/:userId/deactivateIdVerifyPrompt',
  auth,
  makeExpressCallback(userController.deactivateIdVerifyPrompt),
);

router.post(
  '/:userId/deactivatePortfolioVisited',
  auth,
  makeExpressCallback(userController.deactivatePortfolioVisitedPrompt),
);

router.delete('/:userId', auth, makeExpressCallback(userController.deactivateUser));
router.post(
  '/:userId/activate',
  adminAuth,
  makeExpressCallback(userController.activateUser),
);
router.post(
  '/:userId/optOutOfEmail',
  adminAuth,
  makeExpressCallback(userController.optOutOfEmail),
);
router.post(
  '/:userId/optInOfEmail',
  adminAuth,
  makeExpressCallback(userController.optInOfEmail),
);
// Ssn Verification failed
router.post('/verify', makeExpressCallback(userController.verifyEmail));
router.post('/resetPassword', auth, makeExpressCallback(userController.updatePassword));
router.post(
  '/setNewPassword',
  auth,
  makeExpressCallback(userController.updateNewPassword),
);
router.put(
  '/:userId/setNewPasswordWithCurrentPassword',
  auth,
  makeExpressCallback(userController.setNewPasswordWithCurrentPassword),
);
router.post('/:userId/feedback', auth, makeExpressCallback(userController.feedback));
router.post('/:userId/contactUs', auth, makeExpressCallback(userController.contactUs));
router.post('/verifySsn', makeExpressCallback(userController.verifySsn));

// idologyRoutes
router.get('/:userId/kyc', auth, makeExpressCallback(userController.getUserWithKyc));
router.post(
  '/:userId/verifyUser',
  auth,
  makeExpressCallback(userController.identityCheck),
);

// plaid idv routes
router.post(
  '/:userId/plaid/:verificationId/idv',
  auth,
  makeExpressCallback(userController.initiatePlaidIdv),
);

router.post(
  '/:userId/plaid/create-idv',
  auth,
  makeExpressCallback(userController.createPlaidIdv),
)

router.post(
  '/:userId/resetKycStatus',
  adminAuth,
  makeExpressCallback(userController.resetKycStatus),
);

// investorRoutes
router.get(
  '/:userId/investedAmount',
  auth,
  makeExpressCallback(userController.calculateInvestedAmount),
);
router.get(
  '/:userId/investments',
  auth,
  makeExpressCallback(userController.getUserInvestments),
);
router.get(
  '/:userId/accumulatedInvestments',
  auth,
  makeExpressCallback(userController.accumulatedInvestments),
);

router.get(
  '/:userId/investmentsByInvestorId',
  auth,
  makeExpressCallback(userController.getAllInvestorInvestments),
);

router.get(
  '/:userId/entity/:entityId/allInvestments',
  auth,
  makeExpressCallback(userController.getAllInvestorAndEntityInvestments),
);
router.get(
  '/:userId/entity/:entityId/investments',
  auth,
  makeExpressCallback(userController.getEntityInvestments),
);
router.get(
  '/:userId/remainingInvestments',
  auth,
  makeExpressCallback(userController.getUserRemainingInvestmentLimit),
);
router.get(
  '/:userId/portfolio',
  auth,
  makeExpressCallback(userController.investorPortfolio),
);

router.get(
  '/:userId/entity/:entityId/portfolio',
  auth,
  makeExpressCallback(userController.investorPortfolio),
);

router.get(
  '/:userId/investmentLimitAvailability',
  auth,
  makeExpressCallback(userController.investorInvestmentLimitAvailability),
);

// accreditationRoutes
router.post(
  '/:userId/initiate-accreditation',
  auth,
  makeExpressCallback(userController.initiateAccreditation),
);
router.get(
  '/:userId/accreditations',
  auth,
  makeExpressCallback(userController.investorAccreditation),
);
router.get(
  '/:userId/investorAccreditations',
  adminAuth,
  makeExpressCallback(userController.allInvestorAccreditations),
);

// acknowledgementRoutes
router.get(
  '/:userId/acknowledgements',
  auth,
  makeExpressCallback(tosController.getUserTos),
);
router.post(
  '/:userId/acknowledgements',
  auth,
  makeExpressCallback(userController.saveAcknowledgements),
);

// campaignRoutes
router.get('/:userId/qa', auth, makeExpressCallback(userController.getUserQA));
router.get(
  '/:userId/campaigns',
  auth,
  makeExpressCallback(campaignController.getOwnerCampaigns),
);
router.get(
  '/:userId/favorite',
  adminAuth,
  makeExpressCallback(userController.getUserFavoriteCampaign),
);

router.post(
  '/:userId/transfer',
  auth,
  makeExpressCallback(dwollaToBankTransactionsController.addDwollaToBankTransaction),
);

router.get(
  '/:userId/investmentPerAnum',
  auth,
  makeExpressCallback(userController.getUserInvestmentPerAnum),
),
  router.post(
    '/:userId/shouldActivateWallet',
    auth,
    makeExpressCallback(userController.updateUserLastPromtValue),
  ),
  router.get(
    '/:investorId/notifications',
    auth,
    makeExpressCallback(campaignNotificationController.getCampaignNotificationByInvestor),
  );
router.put(
  '/:investorId/notification/:campaignNotificationId',
  auth,
  makeExpressCallback(campaignNotificationController.updateNotification),
);
router.use('/:userId/documents', auth, UserDocumentRoutes);
router.use('/:userId/notifications', auth, UserNotification);
router.use('/:userId/appFeedbacks', auth, UserAppFeedbackRoutes);
router.use('/:userId/exceptions', UncaughtExceptionRoutes);
router.use('/:userId/media', UserMediaRoutes);
router.use('/:userId/events', UserEventRoutes);
router.use('/:userId/issues', UserIssuesRoutes);
router.use('/:userId/banks', auth, InvestorBankRoutes);
router.use('/:userId/card', auth, InvestorCardRoute);

export default router;
