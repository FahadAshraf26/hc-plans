import express from 'express';
const router = express.Router({ mergeParams: true });

import makeExpressCallback from '../Utils/makeExpressCallback';
import container from '@infrastructure/DIContainer/container';
import adminAuth from '@http/Middleware/adminAuth';
import ExportDataController from '@http/Controllers/ExportDataController';
const exportDataController = container.get<ExportDataController>(ExportDataController);

router.get('/', adminAuth, makeExpressCallback(exportDataController.getAllExport));
router.post(
  '/signedUrl',
  adminAuth,
  makeExpressCallback(exportDataController.getSignedUrl),
);
router.post(
  '/allCampaignTagsData',
  adminAuth,
  makeExpressCallback(exportDataController.getAllCampaignTags),
);
router.post(
  '/allUsersInvestments',
  adminAuth,
  makeExpressCallback(exportDataController.getAllUsersInvestments),
)


export default router;
