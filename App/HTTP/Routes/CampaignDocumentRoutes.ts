import express from 'express';
const router = express.Router({ mergeParams: true });
import uploadFile from '../Middleware/UploadFile';
import container from '@infrastructure/DIContainer/container';
import CampaignDocumentController from '../Controllers/CampaignDocumentController';
import auth from '../Middleware/auth';
import adminAuth from '../Middleware/adminAuth';
import makeExpressCallback from '../Utils/makeExpressCallback';

const campaignDocumentController = container.get<CampaignDocumentController>(
  CampaignDocumentController,
);

router.get('/', makeExpressCallback(campaignDocumentController.getCampaignDocuments));
router.post(
  '/',
  uploadFile.array('campaignDocument'),
  adminAuth,
  makeExpressCallback(campaignDocumentController.createCampaignDocument),
);
router.get(
  '/campaignNPA',
  auth,
  makeExpressCallback(campaignDocumentController.getCampaignNPA),
);
router.get(
  '/:campaignDocumentId',
  auth,
  makeExpressCallback(campaignDocumentController.findCampaignDocument),
);
router.put(
  '/:campaignDocumentId',
  adminAuth,
  uploadFile.single('campaignDocument'),
  makeExpressCallback(campaignDocumentController.updateCampaignDocument),
);
router.delete(
  '/:campaignDocumentId',
  adminAuth,
  makeExpressCallback(campaignDocumentController.removeCampaignDocument),
);

export default router;
