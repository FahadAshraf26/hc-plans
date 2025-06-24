import express from 'express';
import adminAuth from '@http/Middleware/adminAuth';
import path from 'path';
import multer from 'multer';

const csvPath = path.resolve('./Storage');
const csvUploader = multer({ dest: csvPath });
const router = express.Router({ mergeParams: true });

import container from '@infrastructure/DIContainer/container';
import makeExpressCallback from '../Utils/makeExpressCallback';
import DwollaPreTransactionsController from '@http/Controllers/DwollaPreTransactionsController';

const dwollaPreTransactionsController = container.get<DwollaPreTransactionsController>(
  DwollaPreTransactionsController,
);

router.post(
  '/',
  adminAuth,
  csvUploader.single('transferCSV'),
  makeExpressCallback(dwollaPreTransactionsController.addDwollaPreTransactions),
);

router.get(
  '/latestRecords',
  adminAuth,
  makeExpressCallback(dwollaPreTransactionsController.getAllLatestPreTransactions),
);

router.get(
  '/:dwollaPreTransactionId',
  adminAuth,
  makeExpressCallback(dwollaPreTransactionsController.getDwollaPreTransactionById),
);

router.put(
  '/:dwollaPreTransactionId',
  adminAuth,
  makeExpressCallback(dwollaPreTransactionsController.updatePreTransactions),
);

router.put(
  '/reEvaluate/:uploadId',
  adminAuth,
  makeExpressCallback(dwollaPreTransactionsController.reEvaluatePreTransactions),
);

router.delete(
  '/:uploadId',
  adminAuth,
  makeExpressCallback(dwollaPreTransactionsController.removeByUploadId),
);

export default router;
