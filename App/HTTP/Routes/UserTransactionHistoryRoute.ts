import express from 'express';
const router = express.Router({ mergeParams: true });

import makeExpressCallback from '../Utils/makeExpressCallback';
import container from '@infrastructure/DIContainer/container';
import UserTransactionHistoryController from '@http/Controllers/UserTransactionHistoryController';
import auth from '@http/Middleware/auth';

const userTransactionHistoryController = container.get<UserTransactionHistoryController>(
  UserTransactionHistoryController,
);

router.get(
  '/:investorId',
  auth,
  makeExpressCallback(userTransactionHistoryController.getInvestorTransactionHistory),
);

router.get(
  '/:investorId/entity/:entityId',
  auth,
  makeExpressCallback(userTransactionHistoryController.getEntityTransactionHistory),
);

export default router;
