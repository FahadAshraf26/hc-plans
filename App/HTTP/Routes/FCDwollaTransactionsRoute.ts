import FCDwollaTransactionsController from '@http/Controllers/FCDwollaTransactionsController';
import adminAuth from '@http/Middleware/adminAuth';
import makeExpressCallback from '@http/Utils/makeExpressCallback';
import container from '@infrastructure/DIContainer/container';
import express from 'express';

const router = express.Router({ mergeParams: true });

const fcDwollaController = container.get<FCDwollaTransactionsController>(FCDwollaTransactionsController);

router.post(
    '/funds',
    adminAuth,
    makeExpressCallback(fcDwollaController.sendFundsToDwolla)
  );

router.get('/', adminAuth, makeExpressCallback(fcDwollaController.fetchAllTransactions))  

export default router;