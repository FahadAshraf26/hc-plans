import express from 'express';
const router = express.Router({ mergeParams: true });
import AdminUserController from '../Controllers/AdminUserController';
import UncaughtExceptionController from '../Controllers/UncaughtExceptionController';
import makeExpressCallback from '../Utils/makeExpressCallback';
import container from '../../Infrastructure/DIContainer/container';
import DashboardDataController from '@controller/DashboardDataController';
const adminUserController = container.get<AdminUserController>(AdminUserController);
const uncaughtExceptionController = container.get<UncaughtExceptionController>(
  UncaughtExceptionController,
);
const dashboardDataController = container.get<DashboardDataController>(DashboardDataController);

router.get('/dashboard', makeExpressCallback(dashboardDataController.getTotalAmountOfCampaigns));
router.get('/dashboard/active', makeExpressCallback(dashboardDataController.getTotalAmountOfActiveCampaigns));
router.get('/', makeExpressCallback(adminUserController.getAdmin));
router.post('/', makeExpressCallback(adminUserController.createAdmin));
router.put('/:adminUserId', makeExpressCallback(adminUserController.updateAdmin));
router.delete('/:adminUserId', makeExpressCallback(adminUserController.removeAdmin));

router.get(
  '/exceptions',
  makeExpressCallback(uncaughtExceptionController.getUncaughtExceptions),
);
router.get('/:adminUserId', makeExpressCallback(adminUserController.findAdmin));

export default router;
