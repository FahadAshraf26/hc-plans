import express from 'express';
const router = express.Router({ mergeParams: true });
import UploadImage from '../Middleware/UploadImage';
import CampaignMediaController from '../Controllers/CampaignMediaController';
import container from '../../Infrastructure/DIContainer/container';
import auth from '../Middleware/auth';
import adminAuth from '../Middleware/adminAuth';
import makeExpressCallback from '../Utils/makeExpressCallback';

const campaignMediaController = container.get<CampaignMediaController>(
  CampaignMediaController,
);

router.get('/', makeExpressCallback(campaignMediaController.getCampaignMedia));
router.post(
  '/',
  UploadImage.array('campaignMedia'),
  adminAuth,
  makeExpressCallback(campaignMediaController.createCampaignMedia),
);
router.put('/updateOrder', adminAuth, makeExpressCallback(campaignMediaController.updateCampaignMedia));
router.get(
  '/:campaignMediaId',
  auth,
  makeExpressCallback(campaignMediaController.findCampaignMedia),
);
router.delete(
  '/:campaignMediaId',
  adminAuth,
  makeExpressCallback(campaignMediaController.removeCampaignMedia),
);

export default router;
