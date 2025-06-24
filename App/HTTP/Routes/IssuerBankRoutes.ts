import express from 'express';
const router = express.Router({ mergeParams: true });
import IssuerBankController from '@controller/IssuerBankController';
import makeExpressCallback from '../Utils/makeExpressCallback';
import container from '@infrastructure/DIContainer/container';
import adminAuth from '../Middleware/adminAuth';

const issuerBankController = container.get<IssuerBankController>(IssuerBankController);
router.post('/', makeExpressCallback(issuerBankController.addBank));
router.post(
  '/addBankWithAuthorization',
  adminAuth,
  makeExpressCallback(issuerBankController.addBankWithAuthorization),
);
router.get('/', adminAuth, makeExpressCallback(issuerBankController.getBanks));
router.put(
  '/:issuerBankId',
  adminAuth,
  makeExpressCallback(issuerBankController.updateBank),
);
router.delete(
  '/:issuerBankId',
  adminAuth,
  makeExpressCallback(issuerBankController.removeBank),
);

export default router;
