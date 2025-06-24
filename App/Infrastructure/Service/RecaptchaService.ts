import { injectable } from 'inversify';
import { RecaptchaEnterpriseServiceClient } from '@google-cloud/recaptcha-enterprise';
import { IRecaptchaService } from './IRecaptchaService';
import config from '@infrastructure/Config';
import logger from '@infrastructure/Logger/logger';

@injectable()
class RecaptchaService implements IRecaptchaService {
  private projectId: string;
  private recaptchaKey: string;
  private recaptchaAction: string;

  constructor() {
    this.projectId = config.recaptcha.recaptcha.RECAPTCHA_PROJECT_ID;
  }

  async createAssessment(token, platform, actionName): Promise<number> {
    if (platform === 'android') {
      this.recaptchaKey = config.recaptcha.recaptcha.RECAPTCHA_KEY_ANDROID;
    } else if (platform === 'ios') {
      this.recaptchaKey = config.recaptcha.recaptcha.RECAPTCHA_KEY_IOS;
    } else {
      this.recaptchaKey = config.recaptcha.recaptcha.RECAPTCHA_KEY;
    }
    this.recaptchaAction = actionName;
    // Create the reCAPTCHA client & set the project path. There are multiple
    // ways to authenticate your client. For more information see:
    // https://cloud.google.com/docs/authentication
    // TODO: To avoid memory issues, move this client generation outside
    // of this example, and cache it (recommended) or call client.close()
    // before exiting this method.
    const client = new RecaptchaEnterpriseServiceClient();
    const projectPath = client.projectPath(this.projectId);

    // Build the assessment request.
    const request = {
      assessment: {
        event: {
          token: token,
          siteKey: this.recaptchaKey,
        },
      },
      parent: projectPath,
    };

    // client.createAssessment() can return a Promise or take a Callback
    const [response] = await client.createAssessment(request);

    // Check if the token is valid.
    if (!response.tokenProperties.valid) {
      logger.error(
        'The CreateAssessment call failed because the token was: ' +
          response.tokenProperties.invalidReason,
      );

      throw new Error('Not Allowed');
    }

    // Check if the expected action was executed.
    // The `action` property is set by user client in the
    // grecaptcha.enterprise.execute() method.
    if (response.tokenProperties.action === this.recaptchaAction) {
      // Get the risk score and the reason(s).
      // For more information on interpreting the assessment,
      // see: https://cloud.google.com/recaptcha-enterprise/docs/interpret-assessment
      logger.info('The reCAPTCHA score is: ' + response.riskAnalysis.score);

      response.riskAnalysis.reasons.forEach((reason) => {
        logger.info(reason);
      });
      
      if (platform === 'ios' || platform === 'android') {
        if (response.riskAnalysis.score < 0.1) {
          throw new Error('Not Allowed');
        }
      } else {
        if (response.riskAnalysis.score < 0.7) {
          throw new Error('Not Allowed');
        }
      }

      return response.riskAnalysis.score;
    } else {
      logger.error(
        'The action attribute in your reCAPTCHA tag ' +
          'does not match the action you are expecting to score',
      );
      throw new Error('Not Allowed');
    }
  }
}
export default RecaptchaService;
