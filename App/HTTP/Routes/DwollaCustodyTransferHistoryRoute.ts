import express from 'express';
import adminAuth from '@http/Middleware/adminAuth';

const router = express.Router({ mergeParams: true });

import container from '@infrastructure/DIContainer/container';
import makeExpressCallback from '../Utils/makeExpressCallback';
import DwollaCustodyTransferHistoryController from '@http/Controllers/DwollaCustodyTransferHistoryController';

const dwollaCustodyTransferHistoryController = container.get<
DwollaCustodyTransferHistoryController
>(DwollaCustodyTransferHistoryController);


router.get(
  '/custodyTransferHistory',
  adminAuth,
  makeExpressCallback(dwollaCustodyTransferHistoryController.getCustodyTransferHistory),
);

export default router;
