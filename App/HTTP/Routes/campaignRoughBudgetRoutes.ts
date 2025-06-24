import express from 'express';
import RoughBudgetController from '@controller/CampaignRoughBudgetController';
import auth from '../Middleware/auth';
import adminAuth from '../Middleware/adminAuth';
import makeExpressCallback from '../Utils/makeExpressCallback';
import container from '@infrastructure/DIContainer/container';
const router = express.Router({ mergeParams: true });

const roughBudgetController = container.get<RoughBudgetController>(RoughBudgetController);

router.get('/', makeExpressCallback(roughBudgetController.getRoughBudget));
router.get(
  '/:roughBudgetId',
  auth,
  makeExpressCallback(roughBudgetController.findRoughBudget),
);
router.put(
  '/:roughBudgetId',
  adminAuth,
  makeExpressCallback(roughBudgetController.updateRoughBudget),
);
router.delete(
  '/:roughBudgetId',
  adminAuth,
  makeExpressCallback(roughBudgetController.removeRoughBudget),
);
router.post('/', adminAuth, makeExpressCallback(roughBudgetController.createRoughBudget));

export default router;
