import express from 'express';
const router = express.Router({ mergeParams: true });
import AdminRoleController from '../Controllers/AdminRoleController';
import makeExpressCallback from '../Utils/makeExpressCallback';
import container from '../../Infrastructure/DIContainer/container';

const adminRoleController = container.get<AdminRoleController>(AdminRoleController);

router.get('/', makeExpressCallback(adminRoleController.getAdminRole));
router.post('/', makeExpressCallback(adminRoleController.createAdminRole));
router.put('/:adminRoleId', makeExpressCallback(adminRoleController.updateAdminRole));
router.delete('/:adminRoleId', makeExpressCallback(adminRoleController.removeAdminRole));
router.get('/:adminRoleId', makeExpressCallback(adminRoleController.findAdminRole));

export default router;
