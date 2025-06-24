import express from 'express';
const router = express.Router({ mergeParams: true });
import CampaignInfoController from '../Controllers/CampaignInfoController';
import auth from '../Middleware/auth';
import adminAuth from '../Middleware/adminAuth';
import makeExpressCallback from '../Utils/makeExpressCallback';
import container from '../../Infrastructure/DIContainer/container';

const campaignInfoController = container.get<CampaignInfoController>(
  CampaignInfoController,
);

router.get('/', makeExpressCallback(campaignInfoController.getCampaignInfo));
router.get(
  '/:campaignInfoId',
  auth,
  makeExpressCallback(campaignInfoController.findCampaignInfo),
);
router.put(
  '/:campaignInfoId',
  adminAuth,
  makeExpressCallback(campaignInfoController.updateCampaignInfo),
);
router.delete(
  '/:campaignInfoId',
  adminAuth,
  makeExpressCallback(campaignInfoController.removeCampaignInfo),
);
router.post(
  '/',
  adminAuth,
  makeExpressCallback(campaignInfoController.createCampaignInfo),
);

export default router;
