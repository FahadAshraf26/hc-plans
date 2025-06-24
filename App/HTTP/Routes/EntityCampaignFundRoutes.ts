import express from 'express';
const router = express.Router({ mergeParams: true });
import CampaignFundController from '../Controllers/CampaignFundController';
import auth from '../Middleware/auth';
import makeExpressCallback from '../Utils/makeExpressCallback';
import container from '@infrastructure/DIContainer/container';
import adminAuth from '@http/Middleware/adminAuth';
import EntityCampaignFundController from '@http/Controllers/EntityCampaignFundController';

const campaignFundController = container.get<CampaignFundController>(
  CampaignFundController,
);
const entityCampaignFundController = container.get<EntityCampaignFundController>(
  EntityCampaignFundController,
);

// router.post('/', auth, makeExpressCallback(campaignFundController.createCampaignFund));
// router.post("/:campaignFundId/returnFund",adminAuth,makeExpressCallback(campaignFundController.returnFundRequest));
// router.get('/', auth, makeExpressCallback(campaignFundController.getCampaignFund));

// router.get(
//   '/:campaignFundId',
//   auth,
//   makeExpressCallback(campaignFundController.findCampaignFund),
// );
// router.put(
//   '/:campaignFundId',
//   auth,
//   makeExpressCallback(campaignFundController.updateCampaignFund),
// );
// router.delete(
//   '/:campaignFundId',
//   auth,
//   makeExpressCallback(campaignFundController.removeCampaignFund),
// );
// router.put(
//   '/:campaignFundId/charge',
//   auth,
//   makeExpressCallback(campaignFundController.updateCampaignFundCharge),
// );

// Entity campaign fund routes
router.post(
  '/:entityId/funds',
  auth,
  makeExpressCallback(entityCampaignFundController.createEntityCampaignFund),
);
router.post(
  '/:entityId/clientSecret',
  auth,
  makeExpressCallback(entityCampaignFundController.createClientSecret),
);
router.post(
  '/:entityId/updateEPayTransaction',
  auth,
  makeExpressCallback(entityCampaignFundController.updateEPayTransfers),
);
router.post(
  '/:entityId/cancelPaymentIntent',
  auth,
  makeExpressCallback(entityCampaignFundController.cancelPaymentIntent),
);
export default router;
