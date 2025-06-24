import express from 'express';
import adminAuth from '@http/Middleware/adminAuth';

const router = express.Router({ mergeParams: true });

import container from '@infrastructure/DIContainer/container';
import makeExpressCallback from '../Utils/makeExpressCallback';
import DwollaPostTransactionsController from '@http/Controllers/DwollaPostTransactionsController';

const dwollaPostTransactionsController = container.get<DwollaPostTransactionsController>(
  DwollaPostTransactionsController,
);

router.post(
  '/:uploadId',
  adminAuth,
  makeExpressCallback(dwollaPostTransactionsController.createPostTransfer),
);

router.get(
  '/',
  adminAuth,
  makeExpressCallback(dwollaPostTransactionsController.getAllPostTransfers),
);

router.get(
  '/:dwollaTransferId',
  adminAuth,
  makeExpressCallback(dwollaPostTransactionsController.getByTransferId),
);

export default router;
