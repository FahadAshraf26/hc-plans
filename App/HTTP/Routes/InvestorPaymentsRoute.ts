import makeExpressCallback from '@http/Utils/makeExpressCallback';
import express from 'express';
const router = express.Router({ mergeParams: true });

import InvestorPaymentsController from '@http/Controllers/InvestorPaymentsController';
import auth from '../Middleware/auth';
import container from '@infrastructure/DIContainer/container';

const investorPaymentsController = container.get<InvestorPaymentsController>(
  InvestorPaymentsController,
);

router.get(
  '/',
  auth,
  makeExpressCallback(investorPaymentsController.getInvestorPayments),
);
router.get(
  '/campaign/:campaignId',
  auth,
  makeExpressCallback(investorPaymentsController.getInvestorCampaignPayments),
);
router.get(
  '/:investorId/campaign/:campaignId',
  auth,
  makeExpressCallback(investorPaymentsController.getCampaignPortfolio),
);

export default router;
