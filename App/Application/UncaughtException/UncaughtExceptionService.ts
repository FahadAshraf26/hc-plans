import UncaughtException from '@domain/Core/UncaughtException/UncaughtException';
import { UncaughtExceptionTypes } from '@domain/Core/ValueObjects/UncaughtExceptionTypes';
import LogUncaughtAppExceptionDTO from './LogUncaughtAppExceptionDTO';
import GetUncaughtExceptionsDTO from '../../Application/UncaughtException/GetUncaughtExceptionsDTO';
import mailService from '@infrastructure/Service/MailService';
import emailTemplates from '@domain/Utils/EmailTemplates';
const { SendHtmlEmail } = mailService;
const { UncaughtExceptionTemplate } = emailTemplates;
import config from '@infrastructure/Config';
import { inject, injectable } from 'inversify';
import {
  IUncaughtExceptionRepository,
  IUncaughtExceptionRepositoryId,
} from '@domain/Core/UncaughtException/IUncaughtExceptionRepository';
import { IUncaughtExceptionService } from '@application/UncaughtException/IUncaughtExceptionService';
const { emailConfig, server } = config;

/**
 * type of data passed to uncaughtException data
 * @typedef {{userId:string,errorName:string,requestData: Object,queryParams: Object,url?: string,errorStack?:string}} ExceptionData
 */

const sensitiveFields = ['ssn', 'routingNumber', 'accountNumber', 'wireRoutingNumber'];

type ExceptionData = {
  userId: string;
  errorName: string;
  requestData: Object;
  queryParams: Object;
  url?: string;
  errorStack?: string;
  ip?: string;
};

// TODO: Supressing all Oops emails, @Fahad, need to look into the errors, then we can enable it again.
@injectable()
class UncaughtExceptionService implements IUncaughtExceptionService {
  constructor(
    @inject(IUncaughtExceptionRepositoryId)
    private uncaughtExceptionRepository: IUncaughtExceptionRepository,
  ) {}
  /**
   *
   * @param {Object} req - express reqeust
   * @param {Error} error
   */
  async logServerException(req, error) {
    const bodyWithoutSensitiveData = {};
    for (const key in req.body) {
      if (sensitiveFields.includes(key)) {
        continue;
      }

      bodyWithoutSensitiveData[key] = req.body[key];
    }

    /**
     * @type ExceptionData
     */
    const exceptionData: ExceptionData = {
      userId: req.decoded ? req.decoded.userId : undefined,
      errorName: error.name,
      requestData: bodyWithoutSensitiveData,
      queryParams: req.query,
      url: req.originalUrl,
      errorStack: error.stack,
      ip: req.clientIp,
    };

    const uncaughtException = UncaughtException.createFromDetail(
      error.message || 'Unexpected Error',
      UncaughtExceptionTypes.SERVER,
      exceptionData,
    );

    // send email
    const html = UncaughtExceptionTemplate.replace(
      '{@EMAIL}',
      req.decoded ? req.decoded.email : 'not available',
    )
      .replace('{@ERROR_MESSAGE}', error.message)
      .replace('{@ERROR_ORIGIN}', UncaughtExceptionTypes.SERVER)
      .replace('{@EXCEPTION_ID}', uncaughtException.uncaughtExceptionId);

    await Promise.all([
      // SendHtmlEmail(
      //   server.IS_PRODUCTION
      //     ? emailConfig.MIVENTURE_SUPPORT_EMAIL
      //     : 'fahad.ashraf@carbonteq.com',
      //   'Oops! An unexpected error occurred!',
      //   html,
      // ),
      this.uncaughtExceptionRepository.add(uncaughtException),
    ]);

    return true;
  }

  async logException(info, error) {
    /**
     * @type ExceptionData
     */
    const exceptionData: ExceptionData = {
      errorName: error.name,
      ...info,
      error,
    };

    const uncaughtException = UncaughtException.createFromDetail(
      error.message || 'Unexpected Error',
      UncaughtExceptionTypes.SERVER,
      exceptionData,
    );

    // send email
    const html = UncaughtExceptionTemplate.replace(
      '{@EMAIL}',
      info.email || 'not available',
    )
      .replace('{@ERROR_MESSAGE}', error.message + '<br>' + JSON.stringify(info))
      .replace('{@ERROR_ORIGIN}', UncaughtExceptionTypes.SERVER)
      .replace('{@EXCEPTION_ID}', uncaughtException.uncaughtExceptionId);

    await Promise.all([
      // SendHtmlEmail(
      //   server.IS_PRODUCTION ? emailConfig.HONEYCOMB_EMAIL : 'fahad.ashraf@carbonteq.com',
      //   'Oops! An unexpected error occurred!',
      //   html,
      // ),
      this.uncaughtExceptionRepository.add(uncaughtException),
    ]);

    return true;
  }

  /**
   *
   * @param {LogUncaughtAppExceptionDTO} logUncaughtAppExceptionDTO
   */
  async logAppException(logUncaughtAppExceptionDTO: LogUncaughtAppExceptionDTO) {
    const req = logUncaughtAppExceptionDTO.getRequest();
    const uncaughtException = logUncaughtAppExceptionDTO.getUncaughtException();

    const bodyWithoutSensitiveData = {};
    for (const key in req.body) {
      if (sensitiveFields.includes(key)) {
        continue;
      }

      bodyWithoutSensitiveData[key] = req.body[key];
    }

    /**
     * @type ExceptionData
     */
    const exceptionData: ExceptionData = {
      userId: req.decoded ? req.decoded.userId : undefined,
      requestData: bodyWithoutSensitiveData,
      queryParams: req.query,
      errorName: logUncaughtAppExceptionDTO.getErrorMssage(),
      ip: req.clientIp,
    };
    uncaughtException.setData(exceptionData);

    // send email
    const html = UncaughtExceptionTemplate.replace(
      '{@EMAIL}',
      req.decoded.email || 'not available',
    )
      .replace('{@ERROR_MESSAGE}', logUncaughtAppExceptionDTO.getErrorMssage())
      .replace('{@ERROR_ORIGIN}', UncaughtExceptionTypes.APP)
      .replace('{@EXCEPTION_ID}', uncaughtException.uncaughtExceptionId);

    await Promise.all([
      // SendHtmlEmail(
      //   emailConfig.HONEYCOMB_EMAIL,
      //   'Oops! An unexpected error occurred!',
      //   html,
      // ),
      this.uncaughtExceptionRepository.add(uncaughtException),
    ]);

    return true;
  }

  async getUncaughtExceptions(getUncaughtExceptionsDTO: GetUncaughtExceptionsDTO) {
    const result = await this.uncaughtExceptionRepository.fetchAllExceptions({
      paginationOptions: getUncaughtExceptionsDTO.getPaginationOptions(),
      query: getUncaughtExceptionsDTO.getQuery(),
    });

    return result.getPaginatedData();
  }
}

export default UncaughtExceptionService;
