import express from 'express';

const router = express.Router({ mergeParams: true });

import makeExpressCallback from '@http/Utils/makeExpressCallback';
import SiteBannerConfigurationController from '@controller/SiteBannerConfigurationController';
import container from '@infrastructure/DIContainer/container';
import auth from '@http/Middleware/auth';

const siteBannerConfigurationController = container.get<
  SiteBannerConfigurationController
>(SiteBannerConfigurationController);

router.post(
  '/',
  auth,
  makeExpressCallback(siteBannerConfigurationController.addSiteBannerConfiguration),
);
router.get(
  '/latestConfiguration',
  makeExpressCallback(siteBannerConfigurationController.fetchSiteBannerConfiguration),
);

export default router;
