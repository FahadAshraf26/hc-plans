import express from 'express';
import adminAuth from '@http/Middleware/adminAuth';
import auth from '@http/Middleware/auth';

const router = express.Router({ mergeParams: true });

import container from '@infrastructure/DIContainer/container';
import makeExpressCallback from '../Utils/makeExpressCallback';
import DwollaToBankTransactionsController from '@http/Controllers/DwollaToBankTransactionsController';

const dwollaToBankTransactionsController = container.get<
  DwollaToBankTransactionsController
>(DwollaToBankTransactionsController);

router.post(
  '/sendFunds',
  adminAuth,
  makeExpressCallback(dwollaToBankTransactionsController.sendFunds),
);

router.get(
  '/allTransfers',
  adminAuth,
  makeExpressCallback(dwollaToBankTransactionsController.getAllDwollaToBankTransactions),
);

router.get(
  '/:userId/allTransfers',
  auth,
  makeExpressCallback(
    dwollaToBankTransactionsController.getAllDwollaToBankTransactionsByUser,
  ),
);

export default router;
