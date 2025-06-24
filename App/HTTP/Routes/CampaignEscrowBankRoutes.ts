import express from 'express';
const router = express.Router({ mergeParams: true });
import CampaignEscrowBankController from '@controller/CampaignEscrowBankController';
import makeExpressCallback from '../Utils/makeExpressCallback';
import container from '@infrastructure/DIContainer/container';

const campaignEscrowBankController = container.get<CampaignEscrowBankController>(
  CampaignEscrowBankController,
);
router.post('/', makeExpressCallback(campaignEscrowBankController.addBank));
router.get('/', makeExpressCallback(campaignEscrowBankController.getBank));
router.post(
  '/:campaignEscrowBankId/initiateVerification',

  makeExpressCallback(campaignEscrowBankController.initiateBankVerification),
);
router.post(
  '/:campaignEscrowBankId/verify',

  makeExpressCallback(campaignEscrowBankController.verifyBank),
);

export default router;
