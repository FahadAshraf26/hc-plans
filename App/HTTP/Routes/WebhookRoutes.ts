import express from 'express';
import WebhookController from '@controller/WebhookController';
import xmlparser from 'express-xml-bodyparser';
import NorcapWebhookRoutes from './NorcapWebhookRoutes';
import USAEpayWebhookRouter from './USAEpayWebhookRoute';
import container from '@infrastructure/DIContainer/container';

const webhookController = container.get<WebhookController>(WebhookController);
const router = express.Router({ mergeParams: true });

router.post('/dwolla/subscribe', webhookController.subscribeDwollaWebhooks);
router.post('/dwolla', webhookController.dwollaWebhook);
router.post('/plaid', webhookController.handlePlaidWebhook);

router.post('/investReady', webhookController.investReadyWebhook);

router.post(
  '/idology',
  xmlparser({
    charkey: 'value',
    trim: false,
    explicitRoot: true,
    explicitArray: false,
    normalizeTags: false,
    mergeAttrs: true,
  }),
  webhookController.idologyWebhook,
);

router.get('/dwolla/responses', webhookController.getAllDwollaWebhookResponses);

router.use('/northCapital', NorcapWebhookRoutes);
router.use('/USAEPay', USAEpayWebhookRouter);
router.get('/dwollaReProcess', webhookController.dwollaRetryWebhook);
router.post('/stripe/response', webhookController.stripeWebhooks);
router.post('/asana/recieveWebhook', webhookController.asanaWebhooks);

export default router;
