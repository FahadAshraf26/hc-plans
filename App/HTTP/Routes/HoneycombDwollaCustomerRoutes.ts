import express from 'express';
const router = express.Router({ mergeParams: true });

import container from '@infrastructure/DIContainer/container';
import makeExpressCallback from '../Utils/makeExpressCallback';
import HoneycombDwollaCustomerController from '@http/Controllers/HoneycombDwollaCustomerController';

const honeycombDwollaCustomerController = container.get<
  HoneycombDwollaCustomerController
>(HoneycombDwollaCustomerController);

router.get(
  '/:userId',
  makeExpressCallback(honeycombDwollaCustomerController.getHoneycombWalletDetail),
);

export default router;
