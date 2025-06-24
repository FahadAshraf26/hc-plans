import express from 'express';
const router = express.Router({ mergeParams: true });
import CampaignAddressController from '@http/Controllers/CampaignAddressController';
import container from '@infrastructure/DIContainer/container';
import adminAuth from '../Middleware/adminAuth';
import makeExpressCallback from '../Utils/makeExpressCallback';

const campaignAddressController = container.get<CampaignAddressController>(
  CampaignAddressController,
);

router.post(
  '/',
  adminAuth,
  makeExpressCallback(campaignAddressController.addCampaignAddress),
);
router.get(
  '/',
  adminAuth,
  makeExpressCallback(campaignAddressController.fetchCampaignAddressByCampaignId),
);
router.put(
  '/:campaignAddressId',
  adminAuth,
  makeExpressCallback(campaignAddressController.updateCampaignAddress),
);

export default router;
