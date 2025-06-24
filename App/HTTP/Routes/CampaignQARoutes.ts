import express from 'express';
const router = express.Router({ mergeParams: true });
import CampaignQAController from '../Controllers/CampaignQAController';
import container from '../../Infrastructure/DIContainer/container';
import CampaignQAReportRoutes from './CampaignQAReportRoutes';
import auth from '../Middleware/auth';
import makeExpressCallback from '../Utils/makeExpressCallback';

const campaignQAController = container.get<CampaignQAController>(CampaignQAController);

router.post('/', auth, makeExpressCallback(campaignQAController.createCampaignQA));
router.get('/', makeExpressCallback(campaignQAController.getCampaignQA));
router.get(
  '/:campaignQAId',
  auth,
  makeExpressCallback(campaignQAController.findCampaignQA),
);
router.put(
  '/:campaignQAId',
  auth,
  makeExpressCallback(campaignQAController.updateCampaignQA),
);
router.delete(
  '/:campaignQAId',
  auth,
  makeExpressCallback(campaignQAController.removeCampaignQA),
);

router.use('/:campaignQAId/reports', CampaignQAReportRoutes);

export default router;
