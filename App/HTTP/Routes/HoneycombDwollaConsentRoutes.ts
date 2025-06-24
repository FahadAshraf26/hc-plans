import express from 'express';
const router = express.Router({ mergeParams: true });

import container from '@infrastructure/DIContainer/container';
import makeExpressCallback from '../Utils/makeExpressCallback';
import HoneycombDwollaConsentController from '@http/Controllers/HoneycombDwollaConsentController';

const honeycombDwollaConsentController = container.get<HoneycombDwollaConsentController>(
  HoneycombDwollaConsentController,
);

router.post(
  '/dwollaCustomerBusiness',
  makeExpressCallback(
    honeycombDwollaConsentController.createBusinessCustomerWithController,
  ),
);

router.post(
  '/dwollaCustomerPersonal',
  makeExpressCallback(honeycombDwollaConsentController.createPersonalCustomer),
);

export default router;
