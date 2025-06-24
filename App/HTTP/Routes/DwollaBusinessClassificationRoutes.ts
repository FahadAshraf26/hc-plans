import express from 'express';
const router = express.Router({ mergeParams: true });

import makeExpressCallback from '../Utils/makeExpressCallback';
import container from '@infrastructure/DIContainer/container';
import DwollaBusinessClassificationController from '@controller/DwollaBusinessClassficationController';
const dwollaBusinessClassificationController = container.get<
  DwollaBusinessClassificationController
>(DwollaBusinessClassificationController);

router.get(
  '/issuer/:issuerId/issuerOwner/:issuerOwnerId',
  makeExpressCallback(dwollaBusinessClassificationController.getBusinessClassifications),
);

export default router;
