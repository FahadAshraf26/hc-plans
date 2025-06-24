import express from 'express';
const router = express.Router({ mergeParams: true });

import CapitalRequestController from '../Controllers/CapitalRequestController';
import auth from '../Middleware/auth';
import adminAuth from '../Middleware/adminAuth';
import makeExpressCallback from '../Utils/makeExpressCallback';
import container from '../../Infrastructure/DIContainer/container';

const capitalRequestController = container.get<CapitalRequestController>(
  CapitalRequestController,
);

router.post(
  '/',
  auth,
  makeExpressCallback(capitalRequestController.createCapitalRequest),
);
router.get(
  '/',
  adminAuth,
  makeExpressCallback(capitalRequestController.getCapitalRequests),
);

export default router;
