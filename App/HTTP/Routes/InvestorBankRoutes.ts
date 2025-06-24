import express from 'express';
const router = express.Router({ mergeParams: true });

import container from '../../Infrastructure/DIContainer/container';
import InvestorBankController from '../Controllers/InvestorBankController';
import makeExpressCallback from '../Utils/makeExpressCallback';

const investorBankController = container.get<InvestorBankController>(
  InvestorBankController,
);

router.post('/', makeExpressCallback(investorBankController.addBank));
router.get('/', makeExpressCallback(investorBankController.getBanks));
router.delete('/:investorBankId', makeExpressCallback(investorBankController.removeBank));

export default router;
