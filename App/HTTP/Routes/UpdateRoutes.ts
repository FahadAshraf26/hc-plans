import express from 'express';
const router = express.Router({ mergeParams: true });

import PushUpdateController from '@controller/PushUpdateController';
import adminAuth from '../Middleware/adminAuth';
import makeExpressCallback from '../Utils/makeExpressCallback';
import container from '@infrastructure/DIContainer/container';

const pushUpdateController = container.get<PushUpdateController>(PushUpdateController);
router.post(
  '/pushUpdate',
  adminAuth,
  makeExpressCallback(pushUpdateController.pushUpdate),
);
router.get(
  '/latestRelease',
  makeExpressCallback(pushUpdateController.fetchLatestRelease),
);

export default router;
