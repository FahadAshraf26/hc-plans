import express from 'express';
const router = express.Router({ mergeParams: true });
import CampaignNewsReportController from '../Controllers/CampaignNewsReportController';
import auth from '../Middleware/auth';
import adminAuth from '../Middleware/adminAuth';
import makeExpressCallback from '../Utils/makeExpressCallback';
import container from '@infrastructure/DIContainer/container';

const campaignNewsReportController = container.get<CampaignNewsReportController>(
  CampaignNewsReportController,
);

router.post(
  '/',
  auth,
  makeExpressCallback(campaignNewsReportController.createCampaignNewsReport),
);
router.get(
  '/',
  adminAuth,
  makeExpressCallback(campaignNewsReportController.getCampaignNewsReportByCampaignNews),
);

export default router;
