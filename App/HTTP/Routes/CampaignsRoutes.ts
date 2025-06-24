import express from 'express';

const router = express.Router({ mergeParams: true });

import CampaignController from '../Controllers/CampaignController';
import CampaignFundController from '../Controllers/CampaignFundController';
import adminAuth from '../Middleware/adminAuth';
import makeExpressCallback from '../Utils/makeExpressCallback';
import CampaignOwnerStoryController from '../Controllers/CampaignOwnerStoryController';
import campaignRiskRoutes from './campaignRiskRoutes';
import CampaignInfoRoutes from './CampaignInfoRoutes';
import CampaignMediaRoutes from './campaignMediaRoutes';
import CampaignTagRoutes from './CampaignTagRoutes';
import CampaignOwnerStoryRoutes from './CampaignOwnerStoryRoutes';
import container from '@infrastructure/DIContainer/container';
import CampaignAddressRoutes from './CampaignAddressRoutes';

const campaignController = container.get<CampaignController>(CampaignController);
const campaignFundController = container.get<CampaignFundController>(
  CampaignFundController,
);
const campaignOwnerStoryController = container.get<CampaignOwnerStoryController>(
  CampaignOwnerStoryController,
);

router.get('/', makeExpressCallback(campaignController.getCampaigns));
router.get(
  '/allFCCampaigns',
  makeExpressCallback(campaignController.getFCCampaignIdAndNames),
);

router.get(
  '/repayments',
  adminAuth,
  makeExpressCallback(campaignController.getCampaignsWithRepayments)
);

router.get(
  '/projectionReturns',
  adminAuth,
  makeExpressCallback(campaignController.getCampaignsWithProjectionReturns)
)

router.get(
  '/opportunities',
  makeExpressCallback(campaignController.fetchPublicOppurtunities),
);

router.get(
  '/stories',
  makeExpressCallback(campaignOwnerStoryController.getCampaignOwnerStory),
);

router.get('/:campaignId', makeExpressCallback(campaignController.findCampaign));
router.post(
  '/:campaignId/subscription-documents/new',
  adminAuth,
  makeExpressCallback(campaignController.sendSubscriptionDocuments),
);

router.post(
  '/:campaignId/funds/report',
  adminAuth,
  makeExpressCallback(campaignFundController.getReport),
);

router.post(
  '/funds/allCampaignsReport',
  adminAuth,
  makeExpressCallback(campaignFundController.getAllCampaignsReport),
);

router.post(
  '/funds/allCampaignInvestmentReport',
  adminAuth,
  makeExpressCallback(campaignFundController.getAllCampaignsInvestmentDetailReport),
);

router.get(
  '/:campaignId/investments',
  adminAuth,
  makeExpressCallback(campaignFundController.getCampaignInvestments),
);

router.get(
  '/investments/report',
  adminAuth,
  makeExpressCallback(campaignFundController.getCampaignInvestmentsReport),
);

router.get('/slug/:slug', makeExpressCallback(campaignController.findCampaignBySlug));

router.use(`/:campaignId/risks`, campaignRiskRoutes);
router.use(`/:campaignId/info`, CampaignInfoRoutes);
router.use('/:campaignId/media', CampaignMediaRoutes);
router.use('/:campaignId/tags', CampaignTagRoutes);
router.use('/:campaignId/stories', CampaignOwnerStoryRoutes);
router.use('/:campaignId/address', CampaignAddressRoutes);

export default router;
