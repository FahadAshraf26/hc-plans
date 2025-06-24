import express from 'express';
const router = express.Router({ mergeParams: true });
import CampaignNotesController from '../Controllers/CampaignNotesController';
import makeExpressCallback from '../Utils/makeExpressCallback';
import container from '@infrastructure/DIContainer/container';

const campaignNotesController = container.get<CampaignNotesController>(
  CampaignNotesController,
);
router.post('/', makeExpressCallback(campaignNotesController.createCampaignNotes));
router.get('/', makeExpressCallback(campaignNotesController.getCampaignNotes));
router.get(
  '/:campaignNotesId',
  makeExpressCallback(campaignNotesController.findCampaignNotes),
);
router.put(
  '/:campaignNotesId',
  makeExpressCallback(campaignNotesController.updateCampaignNotes),
);
router.delete(
  '/:campaignNotesId',
  makeExpressCallback(campaignNotesController.removeCampaignNotes),
);

export default router;
