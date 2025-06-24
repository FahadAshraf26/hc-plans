import express from 'express';
const router = express.Router({ mergeParams: true });

import container from '@infrastructure/DIContainer/container';
import HoneycombDwollaOnDemandAuthorizationController from '../Controllers/HoneycombDwollaOnDemandAuthorizationController';
import makeExpressCallback from '../Utils/makeExpressCallback';

const honeycombDwollaOnDemandAuthorizationController = container.get<
  HoneycombDwollaOnDemandAuthorizationController
>(HoneycombDwollaOnDemandAuthorizationController);

router.get(
  '/',
  makeExpressCallback(
    honeycombDwollaOnDemandAuthorizationController.getDwollaOnDemandAuthorization,
  ),
);

export default router;
