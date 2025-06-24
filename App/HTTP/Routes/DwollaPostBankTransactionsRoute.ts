import express from 'express';
import adminAuth from '@http/Middleware/adminAuth';

const router = express.Router({ mergeParams: true });

import container from '@infrastructure/DIContainer/container';
import makeExpressCallback from '../Utils/makeExpressCallback';
import DwollaPostBankTransactionsController from '@http/Controllers/DwollaPostBankTransactionsController';

const dwollaPostBankTransactionsController = container.get<
  DwollaPostBankTransactionsController
>(DwollaPostBankTransactionsController);

router.post(
  '/:uploadId',
  adminAuth,
  makeExpressCallback(dwollaPostBankTransactionsController.createPostBankTransfer),
);

router.get(
  '/',
  adminAuth,
  makeExpressCallback(dwollaPostBankTransactionsController.getAllPostBankTransfers),
);

router.get(
  '/:dwollaTransferId',
  adminAuth,
  makeExpressCallback(dwollaPostBankTransactionsController.getByTransferId),
);

export default router;
