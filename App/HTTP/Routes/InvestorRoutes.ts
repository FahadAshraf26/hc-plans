import express from 'express';
const router = express.Router({ mergeParams: true });

import CampaignController from '../Controllers/CampaignController';
import auth from '../Middleware/auth';
import makeExpressCallback from '../Utils/makeExpressCallback';
import container from '../../Infrastructure/DIContainer/container';
import ProjectionReturnsController from '@http/Controllers/ProjectionReturnsController';
import InvestorPaymentsController from '@http/Controllers/InvestorPaymentsController';
import RepaymentsController from '@http/Controllers/RepaymentsController';
import CampaignFundController from '@http/Controllers/CampaignFundController';
import adminAuth from '@http/Middleware/adminAuth';

const projectionReturnsController = container.get<ProjectionReturnsController>(
  ProjectionReturnsController,
);
const investorPaymentsController = container.get<InvestorPaymentsController>(
  InvestorPaymentsController,
);
const repaymentController = container.get<RepaymentsController>(RepaymentsController);
const campaignController = container.get<CampaignController>(CampaignController);
const campaignFundController = container.get<CampaignFundController>(
  CampaignFundController,
);

router.get(
  '/:investorId/campaigns',
  auth,
  makeExpressCallback(campaignController.getFavoriteCampaigns),
);

router.get(
  '/:investorId/projections',
  auth,
  makeExpressCallback(
    projectionReturnsController.getAllInvestorCampaignProjectionsReturns,
  ),
);

router.get(
  '/:investorId/projections/entity/:entityId',
  auth,
  makeExpressCallback(
    projectionReturnsController.getAllEntityInvestorCampaignProjectionsReturns,
  ),
);

router.get(
  '/:investorId/repayments',
  auth,
  makeExpressCallback(repaymentController.getAllCompletedRepayments),
);

router.get(
  '/:investorId/repayments/entity/:entityId',
  auth,
  makeExpressCallback(repaymentController.getAllEntityCompletedRepayments),
);

router.get(
  '/:investorId/allPayments',
  auth,
  makeExpressCallback(investorPaymentsController.getCampaignPortfolio),
);

router.get(
  '/:investorId/entity/:entityId/allPayments',
  auth,
  makeExpressCallback(investorPaymentsController.getEntityCampaignPortfolio),
);

router.get(
  '/:investorId/investments',
  auth,
  makeExpressCallback(
    campaignFundController.getInvestorInvestmentsOnCampaignsWithPagination,
  ),
);

router.get(
  '/:investorId/allInvestments',
  auth,
  makeExpressCallback(
    campaignFundController.getInvestorInvestmentsOnCampaignsWithoutPagination,
  ),
);

router.get(
  '/:investorId/allProjectionReturns',
  makeExpressCallback(
    projectionReturnsController.getAllInvestorProjectionsReturnsWithoutPagination,
  ),
);

router.get(
  '/:investorId/projectionReturns',
  makeExpressCallback(
    projectionReturnsController.getAllInvestorProjectionsReturnsWithPagination,
  ),

  router.get(
    '/:investorId/campaignInvestments/:campaignId',
    adminAuth,
    makeExpressCallback(campaignFundController.getInvestorCampaignsInvestment),
  ),
);

export default router;
