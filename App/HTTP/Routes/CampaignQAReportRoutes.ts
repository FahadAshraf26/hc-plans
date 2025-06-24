import express from 'express';
const router = express.Router({ mergeParams: true });

import CampaignQAReportController from '../Controllers/CampaignQAReportController';
import auth from '../Middleware/auth';
import adminAuth from '../Middleware/adminAuth';
import makeExpressCallback from '../Utils/makeExpressCallback';
import container from '@infrastructure/DIContainer/container';

const campaignQAReportController = container.get<CampaignQAReportController>(
  CampaignQAReportController,
);

router.post(
  '/',
  auth,
  makeExpressCallback(campaignQAReportController.createCampaignQAReport),
);
router.get(
  '/',
  adminAuth,
  makeExpressCallback(campaignQAReportController.getCampaignQAReportByCampaignQA),
);

export default router;
