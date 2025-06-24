import adminAuth from '@http/Middleware/adminAuth';
import express from 'express';
const router = express.Router({ mergeParams: true });

import container from '@infrastructure/DIContainer/container';
import makeExpressCallback from '../Utils/makeExpressCallback';
import HoneycombDwollaBeneficialOwnerController from '@http/Controllers/HoneycombDwollaBeneficialOwnerController';

const honeycombDwollaBeneficialOwnerController = container.get<
  HoneycombDwollaBeneficialOwnerController
>(HoneycombDwollaBeneficialOwnerController);

router.post(
  '/businessOwner',
  adminAuth,
  makeExpressCallback(
    honeycombDwollaBeneficialOwnerController.createHoneycombDwollaBeneficialOwner,
  ),
);

router.post(
  '/ceritfyOwner/:dwollaCustomerId',
  adminAuth,
  makeExpressCallback(honeycombDwollaBeneficialOwnerController.certifyBeneficialOwner),
);

export default router;
