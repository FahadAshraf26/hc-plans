import { ISlackServiceId } from './../../Infrastructure/Service/Slack/ISlackService';
import HttpException from '../../Infrastructure/Errors/HttpException';
import logger from '../../Infrastructure/Logger/logger';
import container from '../../Infrastructure/DIContainer/container';
import UncaughtExceptionService from '../../Application/UncaughtException/UncaughtExceptionService';
import { RequestOrigin } from '../../Domain/Core/ValueObjects/RequestOrigin';
import DomainException from '../../Domain/Core/Exceptions/DomainException';
import config from '../../Infrastructure/Config';
import { ISlackService } from '@infrastructure/Service/Slack/ISlackService';
const { server, slackConfig } = config;

const uncaughtExceptionService = container.get<UncaughtExceptionService>(
  UncaughtExceptionService,
);
const slackService = container.get<ISlackService>(ISlackServiceId);

const handleError = async (error, res, req) => {
  logger.error(error);

  if (error instanceof HttpException) {
    if (req.body.email) {
      await slackService.publishMessage({
        message: `Status Code: ${error.status}, email: ${req.body.email}, exception: ${error.message}`,
        slackChannelId: slackConfig.ERROS.ID,
      });
    } else if (req.decoded && req.decoded.email) {
      await slackService.publishMessage({
        message: `Status Code: ${error.status}, email: ${req.decoded.email}, exception: ${error.message}`,
        slackChannelId: slackConfig.ERROS.ID,
      });
    }

    return res.status(error.status).send({
      status: 'error',
      message: error.message,
    });
  }

  if (error instanceof DomainException) {
    if (req.body.email) {
      await slackService.publishMessage({
        message: `Email: ${req.body.email}, Domain Exception: ${error.message}`,
        slackChannelId: slackConfig.ERROS.ID,
      });
    } else {
      await slackService.publishMessage({
        message: `Email: ${req.decoded.email}, Domain Exception: ${error.message}`,
        slackChannelId: slackConfig.ERROS.ID,
      });
    }
    return res.status(400).send({
      status: 'error',
      message: error.message,
      name: error.name,
    });
  }

  if (error.data && error.data.message) {
    error.message = Array.isArray(error.data.message)
      ? error.data.message.join('\n')
      : error.data.message;
  }

  res.status(error.status && typeof error.status === 'number' ? error.status : 500).send({
    status: 'error',
    message: error.message || 'unknown error',
  });

  const isAdminRequest = req.query.requestOrigin === RequestOrigin.ADMIN_PANEL;

  if (!isAdminRequest && server.ENVIRONMENT !== 'local') {
    await uncaughtExceptionService.logServerException(req, error).catch((err) => {
      logger.error(`failed to log exception ${err}`);
      // maybe send an email to support saying this failed
      // should be catched by global error handler
    });
  }

  return;
};

export default handleError;
