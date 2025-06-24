import makeExpressCallback from '@http/Utils/makeExpressCallback';
import express from 'express';
import path from 'path';
import multer from 'multer';
const csvPath = path.resolve('./Storage');
const csvUploader = multer({ dest: csvPath });
const router = express.Router({ mergeParams: true });

import ProjectionReturnsController from '@http/Controllers/ProjectionReturnsController';
import container from '@infrastructure/DIContainer/container';
import adminAuth from '@http/Middleware/adminAuth';
import auth from '@http/Middleware/auth';

const projectionReturnsController = container.get<ProjectionReturnsController>(
  ProjectionReturnsController,
);

router.get(
  '/getUploadProjectionReturnsTemplate',
  adminAuth,
  makeExpressCallback(projectionReturnsController.getUploadProjectionReturnsTemplate)
)
router.get('/investorsProjections',
  adminAuth,
  makeExpressCallback(
    projectionReturnsController.getInvestorsProjections,
  ))

router.get(
  '/allInvestorProjection',
  auth,
  makeExpressCallback(
    projectionReturnsController.getAllInvestorsProjections,
  ),
);

router.get(
  '/:investorId/campaign/:campaignId',
  makeExpressCallback(
    projectionReturnsController.getAllInvestorCampaignProjectionsReturns,
  ),
);

router.get(
  '/:investorId',
  makeExpressCallback(
    projectionReturnsController.getAllInvestorProjectionsReturnsWithPagination,
  ),
);

router.post(
  '/uploadProjectionReturns',
  adminAuth,
  csvUploader.single('investorProjectionReturns'),
  makeExpressCallback(projectionReturnsController.uploadProjectionReturns),
);

router.put(
  '/deleteProjectionReturns',
  adminAuth,
  makeExpressCallback(projectionReturnsController.deleteCampaignsProjectionReturns),
)


export default router;
