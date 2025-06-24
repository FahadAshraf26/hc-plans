import express from 'express';
const router = express.Router({ mergeParams: true });
import UploadImage from '../Middleware/UploadImage';
import CampaignNewsController from '../Controllers/CampaignNewsController';
import auth from '../Middleware/auth';
import CampaignNewsReportRoutes from './CampaignNewsReportRoutes';
import makeExpressCallback from '../Utils/makeExpressCallback';
import container from '@infrastructure/DIContainer/container';
const campaignNewsController = container.get<CampaignNewsController>(
  CampaignNewsController,
);

router.get('/', makeExpressCallback(campaignNewsController.getCampaignNews));
router.get(
  '/:campaignNewsId',
  auth,
  makeExpressCallback(campaignNewsController.findCampaignNews),
);

router.put(
  '/:campaignNewsId',
  auth,
  UploadImage.array('media'),
  makeExpressCallback(campaignNewsController.updateCampaignNews),
);
router.delete(
  '/:campaignNewsId',
  auth,
  makeExpressCallback(campaignNewsController.removeCampaignNews),
);
router.post(
  '/',
  UploadImage.array('media'),
  auth,
  makeExpressCallback(campaignNewsController.createCampaignNews),
);

router.use('/:campaignNewsId/reports', CampaignNewsReportRoutes);

export default router;
