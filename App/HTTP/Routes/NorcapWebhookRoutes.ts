import express from 'express';
const router = express.Router({ mergeParams: true });

import NorthCapitalController from '../Controllers/NorthCapitalWebhookController';
import container from '@infrastructure/DIContainer/container';
const northCapitalController = container.get<NorthCapitalController>(
  NorthCapitalController,
);

router.post('/createTrade', northCapitalController.createTradeHook);
router.post('/updateTradeStatus', northCapitalController.updateTradeStatusHook);
router.post('/updateAiVerification', northCapitalController.updateAiVerificationHook);
router.post('/createParty', northCapitalController.createPartyHook);
router.post('/createAccount', northCapitalController.createAccountHook);
router.post('/updateCCFundMoveStatus', northCapitalController.updateCCFundMoveStatus);
router.post('/updateBankFundMoveStatus', northCapitalController.updateBankFundMoveStatus);

export default router;
