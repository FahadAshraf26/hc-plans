import express from 'express';
const router = express.Router({ mergeParams: true });
import CampaignRiskController from '../Controllers/CampaignRiskController';
import auth from '../Middleware/auth';
import container from '../../Infrastructure/DIContainer/container';
import adminAuth from '../Middleware/adminAuth';
import makeExpressCallback from '../Utils/makeExpressCallback';

const campaignRiskController = container.get<CampaignRiskController>(
  CampaignRiskController,
);

router.post(
  '/',
  adminAuth,
  makeExpressCallback(campaignRiskController.createCampaignRisk),
);
router.get('/', makeExpressCallback(campaignRiskController.getCampaignRisk));
router.get(
  '/:campaignRiskId',
  auth,
  makeExpressCallback(campaignRiskController.findCampaignRisk),
);
router.put(
  '/:campaignRiskId',
  adminAuth,
  makeExpressCallback(campaignRiskController.updateCampaignRisk),
);
router.delete(
  '/:campaignRiskId',
  adminAuth,
  makeExpressCallback(campaignRiskController.removeCampaignRisk),
);

export default router;
