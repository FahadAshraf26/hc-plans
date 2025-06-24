import express from 'express';
const router = express.Router({ mergeParams: true });

import CampaignTagController from '../Controllers/CampaignTagController';
import container from '../../Infrastructure/DIContainer/container';
import auth from '../Middleware/auth';
import adminAuth from '../Middleware/adminAuth';
import makeExpressCallback from '../Utils/makeExpressCallback';

const campaignTagController = container.get<CampaignTagController>(CampaignTagController);

router.get('/', makeExpressCallback(campaignTagController.getCampaignTag));
router.get(
  '/:campaignTagId',
  auth,
  makeExpressCallback(campaignTagController.findCampaignTag),
);
router.post('/', adminAuth, makeExpressCallback(campaignTagController.createCampaignTag));
router.delete(
  '/:campaignTagId',
  adminAuth,
  makeExpressCallback(campaignTagController.removeCampaignTag),
);

export default router;
