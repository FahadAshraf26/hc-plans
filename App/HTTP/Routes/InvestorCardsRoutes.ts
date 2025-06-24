import express from 'express';
const router = express.Router({ mergeParams: true });

import container from '@infrastructure/DIContainer/container';
import makeExpressCallback from '../Utils/makeExpressCallback';
import InvestorCardController from '../Controllers/InvestorCardController';

const investorCardController = container.get<InvestorCardController>(
  InvestorCardController,
);

router.post('/stripeCard', makeExpressCallback(investorCardController.attachCreditCard));
router.post('/:accountId', makeExpressCallback(investorCardController.linkCreditCard));
router.get(
  '/:accountId',
  makeExpressCallback(investorCardController.getLinkedCreditCard),
);

export default router;
