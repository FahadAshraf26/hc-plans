import express from 'express';
import container from '@infrastructure/DIContainer/container';
import USAEpayWebhookController from '@http/Controllers/USAEpayWebhookController';

const usaEpayWebhookController = container.get<USAEpayWebhookController>(
  USAEpayWebhookController,
);
const router = express.Router({ mergeParams: true });

router.post('/transactionSaleSuccess', usaEpayWebhookController.transactionSaleSuccess);
router.post('/transactionSaleFailure', usaEpayWebhookController.trasactionSaleFailure);
router.post('/transactionSaleVoid', usaEpayWebhookController.trasactionSaleVoid);
router.post('/achSettled', usaEpayWebhookController.achSettled);
router.post('/achVoided', usaEpayWebhookController.achVoided);
router.post('/achFailed', usaEpayWebhookController.achFailed);

export default router;
