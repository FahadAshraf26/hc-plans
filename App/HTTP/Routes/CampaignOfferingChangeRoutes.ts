import express from 'express';
const router = express.Router({ mergeParams: true });
import container from '@infrastructure/DIContainer/container';
import CampaignOfferingChangeController from '@http/Controllers/CampaignOfferingChangeController';
import makeExpressCallback from '../Utils/makeExpressCallback';
import adminAuth from '../Middleware/adminAuth';

const campaignOfferingChangeController = container.get<CampaignOfferingChangeController>(
  CampaignOfferingChangeController,
);

router.get(
  '/:campaignOfferingChangeId/reconfirm',
  makeExpressCallback(campaignOfferingChangeController.reconfirmCampaignOfferingChange),
);

router.post(
  '/:campaignId/triggerOfferChanges',
  adminAuth,
  makeExpressCallback(campaignOfferingChangeController.triggerOfferedChanges),
);

export default router;
