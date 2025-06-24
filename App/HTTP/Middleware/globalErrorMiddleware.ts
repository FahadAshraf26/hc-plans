import container from '@infrastructure/DIContainer/container';
import { RequestOrigin } from '@domain/Core/ValueObjects/RequestOrigin';
import logger from '@infrastructure/Logger/logger';
import {
  IUncaughtExceptionService,
  IUncaughtExceptionServiceId,
} from '@application/UncaughtException/IUncaughtExceptionService';

const uncaughtExceptionService = container.get<IUncaughtExceptionService>(
  IUncaughtExceptionServiceId,
);

export default async (error, req, res, next) => {
  logger.error(error);

  const isAdminRequest = req.query.requestOrigin === RequestOrigin.ADMIN_PANEL;

  if (!isAdminRequest) {
    await uncaughtExceptionService.logServerException(req, error);
  }

  return res.status(500).json({
    status: 'error',
    message: 'something went wrong',
    subMessage: error.message,
  });
};
