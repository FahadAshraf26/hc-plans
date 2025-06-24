import DwollaWebhookDTO from '@application/Webhooks/DwollaWebhookDTO';
import InvestReadyWebhookDTO from '@application/Webhooks/InvestReadyWebhookDTO';
import IdologyWebhookDTO from '@application/Webhooks/IdologyWebhookDTO';
import { inject, injectable } from 'inversify';
import { IDwollaService, IDwollaServiceId } from '@infrastructure/Service/IDwollaService';
import {
  IWebhookService,
  IWebhookServiceId,
} from '@application/Webhooks/IWebhookService';
import handleError from '../Utils/handleError';
import GetAllWebhookResponsesDTO from '@application/Webhooks/GetAllWebhookResponsesDTO';
import {
  IStripeWebhook,
  IStripeWebhookId,
} from '@application/Webhooks/StripeWebhook/IStripeWebhook';
import PlaidIDVWebhookDTO from '@application/Webhooks/PlaidIDVWebhook/PlaidIDVWebhookDTO';
import { IPlaidWebhook,IPlaidWebhookId } from '@application/Webhooks/PlaidIDVWebhook/IPlaidWebhook';
import { IPlaidService, IPlaidServiceId } from '@infrastructure/Service/Plaid/IPlaidService';
import HttpError from '@infrastructure/Errors/HttpException';
@injectable()
class WebhookController {
  constructor(
    @inject(IDwollaServiceId) private dwollaService: IDwollaService,
    @inject(IWebhookServiceId) private webhookService: IWebhookService,
    @inject(IStripeWebhookId) private stripeWebhook: IStripeWebhook,
    @inject(IPlaidWebhookId) private plaidWebhookHandler: IPlaidWebhook,
    @inject(IPlaidServiceId) private plaidService: IPlaidService,
  ) {}
  subscribeDwollaWebhooks = async (req, res) => {
    try {
      const { url } = req.body;

      const urlToSubscribe = url || `${req.header('host')}/api/v1/webhooks/dwolla`;

      await this.dwollaService.createWebhookSubscription(urlToSubscribe);

      return res.status(200).json({
        status: 'success',
        message: 'url registered to receive dwollaWebooks',
      });
    } catch (err) {
      await handleError(err, res, req);
    }
  };

  dwollaWebhook = async (req, res) => {
    const { body: event } = req;

    res.status(200).send({
      status: 'success',
    });

    const input = new DwollaWebhookDTO(event);
    await this.webhookService.handleDwollaWebhook(input);

    return;
  };

  dwollaRetryWebhook = async (req, res) => {
    const { date } = req.body;

    await this.webhookService.retryDwollaWebhooks(date, true);
    res.status(200).send({
      status: 'success',
    });
  };

  investReadyWebhook = async (req, res) => {
    const { body: event } = req;

    res.status(200).send({
      status: 'success',
    });

    const input = new InvestReadyWebhookDTO(event);
    await this.webhookService.handleInvestReadyWebhook(input);

    return;
  };

  idologyWebhook = async (req, res) => {
    res.sendStatus(200);

    const input = new IdologyWebhookDTO(req.body);
    await this.webhookService.handleIdologyWebhook(input);

    return;
  };

  getAllDwollaWebhookResponses = async (req, res) => {
    const {
      page,
      perPage,
      showTrashed,
      query,
      dwollaCustomerId,
      customerType,
      userId,
    } = req.query;

    const input = new GetAllWebhookResponsesDTO(
      page,
      perPage,
      showTrashed,
      query,
      dwollaCustomerId,
      customerType,
      userId,
    );
    const response = await this.webhookService.getAllWebhookResponses(input);

    return res.status(200).send({
      status: 'success',
      data: response,
    });
  };

  stripeWebhooks = async (req, res) => {
    const event = req.body;
    await this.stripeWebhook.execute(event);
    return res.json({ received: true });
  };

  asanaWebhooks = async (req, res) => {
    const secret = req.headers['x-hook-secret'];
    const signature = req.headers['x-hook-signature'];
    const body = req.body;

    if (secret) {
      res.setHeader('X-hook-Secret', req.headers['x-hook-secret']);
      return res.sendStatus(200);
    }

    if (signature) {
      const isValidSignature = await this.webhookService.verifyAsanaWebhookSignature(body, signature);
      if (!isValidSignature) {
        return res.sendStatus(401);
      }

      await this.webhookService.handleAsanaWebhook(body.events);
      return res.sendStatus(200);
    }

    return res.sendStatus(400);
  }

  handlePlaidWebhook = async (req, res) => {
    const { webhook_type, webhook_code, identity_verification_id } = req.body;
    res.status(200).json({ received: true });

    try {
      const verification = await this.plaidService.getIdentityVerification(identity_verification_id);
      const userId = verification.client_user_id;

      const webhookDTO = new PlaidIDVWebhookDTO(
        webhook_type,
        webhook_code,
        identity_verification_id,
        userId,
        req.headers.origin || 'webhook',
        req.ip
      );

      await this.plaidWebhookHandler.execute(webhookDTO);
    } catch (error) {
      throw new HttpError(500, 'Failed to process Plaid webhook');
    }
  };
}

export default WebhookController;
