import express from 'express';
const router = express.Router({ mergeParams: true });
import CampaignFavoriteController from '../Controllers/CampaignFavoriteController';
import auth from '../Middleware/auth';
import makeExpressCallback from '../Utils/makeExpressCallback';
import container from '../../Infrastructure/DIContainer/container';

const campaignFavoriteController = container.get<CampaignFavoriteController>(
  CampaignFavoriteController,
);

router.post(
  '/',
  auth,
  makeExpressCallback(campaignFavoriteController.createCampaignFavorite),
);
router.get(
  '/',
  auth,
  makeExpressCallback(campaignFavoriteController.getCampaignFavorite),
);
router.get(
  '/:favoriteCampaignId',
  auth,
  makeExpressCallback(campaignFavoriteController.findCampaignFavorite),
);

router.delete(
  '/',
  auth,
  makeExpressCallback(campaignFavoriteController.removeByInvestor),
);

router.delete(
  '/:favoriteCampaignId',
  auth,
  makeExpressCallback(campaignFavoriteController.removeCampaignFavorite),
);

export default router;
