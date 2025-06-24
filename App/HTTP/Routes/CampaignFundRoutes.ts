import express from 'express';
const router = express.Router({ mergeParams: true });
import CampaignFundController from '../Controllers/CampaignFundController';
import auth from '../Middleware/auth';
import makeExpressCallback from '../Utils/makeExpressCallback';
import container from '@infrastructure/DIContainer/container';
import adminAuth from '@http/Middleware/adminAuth';
import superAdminAuth from '@http/Middleware/superAdminAuth';
const campaignFundController = container.get<CampaignFundController>(
  CampaignFundController,
);

router.post('/', auth, makeExpressCallback(campaignFundController.createCampaignFund));
router.post(
  '/clientSecret',
  auth,
  makeExpressCallback(campaignFundController.createClientSecret),
);
router.post(
  '/updateEPayTransaction',
  auth,
  makeExpressCallback(campaignFundController.updateEPayTransfers),
);
router.post(
  '/cancelPaymentIntent',
  auth,
  makeExpressCallback(campaignFundController.cancelPaymentIntent),
);
router.post(
  '/chargeInvestor',
  makeExpressCallback(campaignFundController.chargeInvestor),
);
router.post(
  '/:campaignFundId/charge',
  adminAuth,
  makeExpressCallback(campaignFundController.returnFundRequest),
);
router.get('/', auth, makeExpressCallback(campaignFundController.getCampaignFund));

router.get(
  '/exportCampaignInvestor',
  auth,
  makeExpressCallback(campaignFundController.getCampaignFundToExport),
);

router.get(
  '/:campaignFundId',
  auth,
  makeExpressCallback(campaignFundController.findCampaignFund),
);

router.put(
  '/:campaignFundId',
  auth,
  makeExpressCallback(campaignFundController.updateCampaignFund),
);
router.delete(
  '/:campaignFundId',
  auth,
  makeExpressCallback(campaignFundController.removeCampaignFund),
);
router.put(
  '/:campaignFundId/status',
  superAdminAuth,
  makeExpressCallback(campaignFundController.updateInvestmentStatus)
);

export default router;
