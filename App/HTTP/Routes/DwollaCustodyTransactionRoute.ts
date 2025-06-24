import express from 'express';
import adminAuth from '@http/Middleware/adminAuth';

const router = express.Router({ mergeParams: true });

import container from '@infrastructure/DIContainer/container';
import makeExpressCallback from '../Utils/makeExpressCallback';
import DwollaCustodyTransactionsController from '@http/Controllers/DwollaCustodyTransactionsController';

const dwollaCustodyTransactionsController = container.get<
  DwollaCustodyTransactionsController
>(DwollaCustodyTransactionsController);

router.post(
  '/:uploadId/toCustody',
  adminAuth,
  makeExpressCallback(dwollaCustodyTransactionsController.transferFundsToCustodyAccount),
);

router.post(
  '/toWallet',
  adminAuth,
  makeExpressCallback(dwollaCustodyTransactionsController.transferFundsToBusinessWallet),
);

router.post(
  '/:issuerId',
  adminAuth,
  makeExpressCallback(
    dwollaCustodyTransactionsController.transferFundsToBusinessWalletByIssuerId,
  ),
);

router.post(
  '/reUpload/:dwollaCustodyTransactionId',
  adminAuth,
  makeExpressCallback(dwollaCustodyTransactionsController.reUploadFailedTransfers),
);

router.get(
  '/allCustodyTransfers',
  adminAuth,
  makeExpressCallback(dwollaCustodyTransactionsController.getAllCustodyTransfers),
);

router.get(
  '/allCompletedCustodyTransfers',
  adminAuth,
  makeExpressCallback(
    dwollaCustodyTransactionsController.getAllCompletedCustodyTransfers,
  ),
);

export default router;
