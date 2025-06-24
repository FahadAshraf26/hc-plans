import express from 'express';
const router = express.Router({ mergeParams: true });

import UncaughtExceptionController from '../Controllers/UncaughtExceptionController';
import auth from '../Middleware/auth';
import makeExpressCallback from '../Utils/makeExpressCallback';
import container from '../../Infrastructure/DIContainer/container';

const uncaughtExceptionController = container.get<UncaughtExceptionController>(
  UncaughtExceptionController,
);

router.post(
  '/',
  auth,
  makeExpressCallback(uncaughtExceptionController.logUncaughtAppEception),
);

export default router;
