import dotenv from 'dotenv';
dotenv.config();
import program from 'commander';
import logger from '../App/Infrastructure/Logger/logger';
import UserService from '../App/Application/User/UserService';
import DripCampaignProcessor from '../App/Application/User/processors/DripCampaignProcessor';
import mailService from '../App/Infrastructure/Service/MailService';
import InvestorFunnelPushNotificationsProcessor from '../App/Application/User/processors/InvestorFunnelPushNotificationsProcessor';
import pushNotificationMessages from '../App/Domain/Utils/PushNotificationMessages';
import container from '../App/Infrastructure/DIContainer/container';

const { SendHtmlEmail } = mailService;
const {
  addBankAccountMessage,
  referAFriendMessage,
  sendFeedbackMessage,
} = pushNotificationMessages;

const userService = container.get<UserService>(UserService);

program
  .command('user-personal-detail-update')
  .alias('userPersonalDetailUpdateAfterFiveDays')
  .description('After user signup notify to update thier personal detail')
  .action(async () => {
    const connection = require('../App/Infrastructure/Database/mysqlConnection');
    logger.debug('start job');
    await userService.PersonalDetailUpdateNotifyAfterFiveDays();
    await connection.close();
    logger.debug('end job');
    return;
  });

program
  .command('user-personal-detail-update')
  .alias('userPersonalDetailUpdateAfterTwoWeeks')
  .description('After user signup notify to update thier personal detail')
  .action(async () => {
    const connection = require('../App/Infrastructure/Database/mysqlConnection');
    logger.debug('start job');
    await userService.PersonalDetailUpdateNotifyAfterTwoWeeks();
    await connection.close();
    logger.debug('end job');
    return;
  });

program
  .command('user-singedup-no-investment-x-days')
  .alias('noInvestmentXdays')
  .description('Sends a notification to users who have not invested in x days')
  .option('-d,--days <number>', 'possible values 2,7,10')
  .action(async (cmd) => {
    const connection = require('../App/Infrastructure/Database/mysqlConnection');
    try {
      logger.debug('start job');
      const days = Number(cmd.days);

      if (isNaN(days)) {
        throw Error('not a number');
      }

      const processor = new DripCampaignProcessor(SendHtmlEmail);
      const { template, subject } = processor.determineTemplateAndStage(days);

      await processor.NotifyUsersWithDaysSinceSignup({
        daysSinceSignedUp: days,
        template,
        subject,
        kycPassed: false,
      });
    } catch (err) {
      logger.error(err);
    } finally {
      logger.debug('end job');
      connection.close();
    }
    return;
  });

program
  .command('user-singedup-no-investment-x-days-kyc-passed')
  .alias('noInvestmentXdaysKycPassed')
  .description('Sends a notification to users who have not invested in x days')
  .option('-d,--days <number>', 'possible values 2,7,10')
  .action(async (cmd) => {
    const connection = require('../App/Infrastructure/Database/mysqlConnection');
    try {
      logger.debug('start job');
      const days = Number(cmd.days);

      if (isNaN(days)) {
        throw Error('not a number');
      }

      const processor = new DripCampaignProcessor(SendHtmlEmail);
      const { template, subject } = processor.determineKycPassedTemplateAndSubject(days);

      await processor.NotifyUsersWithDaysSinceSignup({
        daysSinceSignedUp: days,
        template,
        subject,
        kycPassed: true,
      });
    } catch (err) {
      logger.error(err);
    } finally {
      logger.debug('end job');
      connection.close();
    }
    return;
  });

program
  .command('apple-relay-user-missed-emails')
  .alias('sendAppleRelayFailedEmails')
  .description('sends missed emails to users that did not share their email with the app')
  .action(async (cmd) => {
    const connection = require('../App/Infrastructure/Database/mysqlConnection');
    try {
      logger.debug('start job');
    } catch (err) {
      logger.error(err);
    } finally {
      logger.debug('end job');
      connection.close();
    }
    return;
  });

program
  .command('user-investor-funnel-crons')
  .alias('userInvestorFunnelCrons')
  .option('-j,--job <string>', 'possible values [noBank,noInvestment,refer]')
  .description(
    'sends notification to users based on what stage they are in the investment funnel',
  )
  .action(async (cmd) => {
    const connection = require('../App/Infrastructure/Database/mysqlConnection');
    try {
      logger.debug('start job');
      const funnelService = new InvestorFunnelPushNotificationsProcessor({
        addBankAccountMessage: addBankAccountMessage,
        sendFeedbackMessage: sendFeedbackMessage,
        referAFriendMessage: referAFriendMessage,
      });

      const days = [0, 10, 20];
      const result: any = await Promise.allSettled(
        days.map((day) => {
          switch (cmd.job) {
            case 'noBank':
              return funnelService.NotifyUsersKycPassedNoBankAccount(day);
            case 'noInvestment':
              return funnelService.NotifyEligibleInvestorsForFeedback(day);
            case 'refer':
              return funnelService.NotifyActiveInvestorsToRefer(day);
            default:
              throw new Error('could not run job');
          }
        }),
      );

      let hasError = false;
      result.forEach((jobResult) => {
        if (jobResult.status === 'rejected') {
          hasError = true;
        }
      });

      if (hasError) {
        throw Error(result.filter((r) => r.status === 'rejected').map((r) => r.reason));
      }
    } catch (err) {
      logger.error(err);
    } finally {
      logger.debug('end job');
      connection.close();
    }
    return;
  });

program.parse(process.argv);
