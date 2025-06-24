import program from 'commander';
import logger from '../App/Infrastructure/Logger/logger';
import { SendEmailToNorthCapital } from './SendEmailToNorthCapital';
import { UpdateDwollaInvestmentTransaction } from './UpdateDwollaInvestmentTransaction';
import { publishInvestmentsToSlack } from './totalInvestmentsCronJob';
import { UpdateUSAEPayTradeStatus } from './UpdateUSAEpayTradeStatus';
import { WalletDebitAuthorization } from './WalletDebitAuthorization';
import { CreateNachaFileForRefund } from './CreateNachaFileForRefund';
import { UpdateDwollaRefundStatus } from './UpdateDwollaRefundStatus';

import {
  UpdateCustodyAccountNotCompletedTransactions,
  UpdateCustodyAccountCompletedTransactions,
} from './UpdateCustodyAccountTransactions';
import { UpdateStripeTransactionsStatus } from './UpdateStripeTransactionsStatus';

program.command('campaignFundsDailyEscrowEmail').action(async () => {
  try {
    logger.debug('start campaignFundsDailyEscrowEmail job');
    await SendEmailToNorthCapital();
    logger.debug('end campaignFundsDailyEscrowEmail job');
  } catch (err) {
    logger.error(err);
    throw err;
  } finally {
    process.exit();
  }
});

program.command('updateDwollaInvestmentTransaction').action(async () => {
  try {
    logger.debug('start updateDwollaInvestmentTransaction job');
    await UpdateDwollaInvestmentTransaction();
    logger.debug('end updateDwollaInvestmentTransaction job');
  } catch (err) {
    logger.error(err);
    throw err;
  } finally {
    process.exit();
  }
});

program.command('publishInvestmentsToSlack').action(async () => {
  try {
    logger.debug('start publishInvestmentsToSlack job');
    await publishInvestmentsToSlack();
    logger.debug('end publishInvestmentsToSlack job');
  } catch (err) {
    logger.error(err);
    throw err;
  } finally {
    process.exit();
  }
});

program.command('updateFCTrades').action(async () => {
  try {
    logger.debug('start updateFCTrades job');
    await UpdateUSAEPayTradeStatus();
    logger.debug('end updateFCTrades job');
  } catch (err) {
    throw err;
  } finally {
    process.exit();
  }
});

program.command('walletDebitAuthorization').action(async () => {
  try {
    logger.debug('start walletDebitAuthorization job');
    await WalletDebitAuthorization();
    logger.debug('end walletDebitAuthorization job');
  } catch (err) {
    console.log(err)
    process.exit();
  } finally {
    process.exit();
  }
});

program.command('updateDwollaRefundStatus').action(async () => {
  try {
    logger.debug('start updateDwollaRefundStatus job');
    await UpdateDwollaRefundStatus();
    logger.debug('end updateDwollaRefundStatus job');
  } catch (err) {
    throw err;
  } finally {
    process.exit();
  }
});

program.command('updateCustodyAccountNotCompletedTransactions').action(async () => {
  try {
    logger.debug('start updateCustodyAccountNotCompletedTransactions jon');
    await UpdateCustodyAccountNotCompletedTransactions();
    logger.debug('end updateCustodyAccountNotCompletedTransactions jon');
  } catch (error) {
    throw error;
  } finally {
    process.exit();
  }
});

program.command('createNachaFileForRefund').action(async () => {
  try {
    logger.debug('start createNachaFileForRefund job');
    await CreateNachaFileForRefund();
    logger.debug('end createNachaFileForRefund job');
  } catch (err) {
    throw err;
  } finally {
    process.exit();
  }
});

program.command('updateCustodyAccountCompletedTransactions').action(async () => {
  try {
    logger.debug('start updateCustodyAccountCompletedTransactions jon');
    await UpdateCustodyAccountCompletedTransactions();
    logger.debug('end updateCustodyAccountCompletedTransactions jon');
  } catch (error) {
    throw error;
  } finally {
    process.exit();
  }
});

program.command('updateStripeTransactionsStatus').action(async () => {
  try {
    logger.debug('start updateStripeTransactionsStatus job');
    await UpdateStripeTransactionsStatus();
    logger.debug('end updateStripeTransactionsStatus job');
  } catch (error) {
    throw error;
  } finally {
    process.exit();
  }
});

program.parse(process.argv);
