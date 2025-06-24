import express from 'express';
import adminAuth from '@http/Middleware/adminAuth';
import path from 'path';
import multer from 'multer';

const csvPath = path.resolve('./Storage');
const csvUploader = multer({ dest: csvPath });
const router = express.Router({ mergeParams: true });

import container from '@infrastructure/DIContainer/container';
import makeExpressCallback from '../Utils/makeExpressCallback';
import DwollaPreBankTransactionsController from '@http/Controllers/DwollaPreBankTransactionsController';

const dwollaPreBankTransactionsController = container.get<
  DwollaPreBankTransactionsController
>(DwollaPreBankTransactionsController);

router.post(
  '/',
  adminAuth,
  csvUploader.single('bankTransferCSV'),
  makeExpressCallback(dwollaPreBankTransactionsController.addDwollaPreBankTransactions),
);

router.get(
  '/latestRecordsForWallet',
  adminAuth,
  makeExpressCallback(
    dwollaPreBankTransactionsController.getAllLatestPreBankTransactionsForWallet,
  ),
);

router.get(
  '/latestRecordsForCustody',
  adminAuth,
  makeExpressCallback(
    dwollaPreBankTransactionsController.getAllLatestPreBankTransactionsForCustody,
  ),
);

router.get(
  '/:dwollaPreBankTransactionId',
  adminAuth,
  makeExpressCallback(
    dwollaPreBankTransactionsController.getDwollaPreBankTransactionById,
  ),
);

router.put(
  '/:dwollaPreBankTransactionId',
  adminAuth,
  makeExpressCallback(dwollaPreBankTransactionsController.updatePreBankTransactions),
);

router.put(
  '/reEvaluate/:uploadId',
  adminAuth,
  makeExpressCallback(dwollaPreBankTransactionsController.reEvaluateData),
);

router.delete(
  '/:dwollaPreBankTransactionId',
  adminAuth,
  makeExpressCallback(dwollaPreBankTransactionsController.removeByDwollaPreBankTransactionId),
);

router.delete(
  '/:uploadId/byUploadId',
  adminAuth,
  makeExpressCallback(dwollaPreBankTransactionsController.removeByUploadId),
);



export default router;
