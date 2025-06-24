import express from 'express';
const router = express.Router({ mergeParams: true });

import makeExpressCallback from '../Utils/makeExpressCallback';
import container from '@infrastructure/DIContainer/container';
import DwollaBalanceController from '@http/Controllers/DwollaBalanceController';
import auth from '@http/Middleware/auth';

const dwollaBalanceController = container.get<DwollaBalanceController>(
  DwollaBalanceController,
);

router.post(
  '/:dwollaBalanceId',
  auth,
  makeExpressCallback(dwollaBalanceController.getDwollaBalance),
);

export default router;
