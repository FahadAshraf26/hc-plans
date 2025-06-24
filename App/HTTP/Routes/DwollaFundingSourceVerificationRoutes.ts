import express from 'express';
const router = express.Router({ mergeParams: true });

import makeExpressCallback from '../Utils/makeExpressCallback';
import container from '@infrastructure/DIContainer/container';
import adminAuth from '@http/Middleware/adminAuth';
import DwollaFundingSourceVerificationController from '@http/Controllers/DwollaFundingSourceVerificationController';

const dwollaFundingSourceVerificationController = container.get<
  DwollaFundingSourceVerificationController
>(DwollaFundingSourceVerificationController);

router.post(
  '/:dwollaSourceId',
  adminAuth,
  makeExpressCallback(
    dwollaFundingSourceVerificationController.initiateDwollaFundingSourceMicroDeposite,
  ),
);

router.post(
  '/:dwollaSourceId/verifyMicroDeposite',
  makeExpressCallback(
    dwollaFundingSourceVerificationController.verifyDwollaFundingSourceMicroDeposite,
  ),
);

export default router;
