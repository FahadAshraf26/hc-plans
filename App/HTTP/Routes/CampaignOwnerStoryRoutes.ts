import express from 'express';
const router = express.Router({ mergeParams: true });
import CampaignOwnerStoryController from '../Controllers/CampaignOwnerStoryController';
import UploadImage from '../Middleware/UploadImage';
import container from '../../Infrastructure/DIContainer/container';
import makeExpressCallback from '../Utils/makeExpressCallback';

const campaignOwnerStoryController = container.get<CampaignOwnerStoryController>(
  CampaignOwnerStoryController,
);

router.post(
  '/',
  UploadImage.single('media'),
  makeExpressCallback(campaignOwnerStoryController.createCampaignOwnerStory),
);
router.get(
  '/',
  makeExpressCallback(campaignOwnerStoryController.getOwnerStoryByCampaign),
);

router.get(
  '/:campaignOwnerStoryId',
  makeExpressCallback(campaignOwnerStoryController.findCampaignOwnerStory),
);
router.put(
  '/:campaignOwnerStoryId',
  UploadImage.single('media'),
  makeExpressCallback(campaignOwnerStoryController.updateCampaignOwnerStory),
);
router.delete(
  '/:campaignOwnerStoryId',
  makeExpressCallback(campaignOwnerStoryController.removeCampaignOwnerStory),
);

export default router;
