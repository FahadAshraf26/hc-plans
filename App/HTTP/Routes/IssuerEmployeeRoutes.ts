import express from 'express';
const router = express.Router({ mergeParams: true });
import container from '@infrastructure/DIContainer/container';
import UploadImage from '../Middleware/UploadImage';
import EmployeeController from '../Controllers/EmployeeController';
import makeExpressCallback from '../Utils/makeExpressCallback';
import adminAuth from '../Middleware/adminAuth';

const employeeController = container.get<EmployeeController>(EmployeeController);

router.get('/', makeExpressCallback(employeeController.getEmployees));
router.post(
  '/',
  adminAuth,
  UploadImage.single('employeePic'),
  makeExpressCallback(employeeController.createEmployee),
);
router.get(
  '/:employeeId',
  adminAuth,
  makeExpressCallback(employeeController.findEmployee),
);
router.put(
  '/:employeeId',
  adminAuth,
  UploadImage.single('employeePic'),
  makeExpressCallback(employeeController.updateEmployee),
);
router.delete(
  '/:employeeId',
  adminAuth,
  makeExpressCallback(employeeController.removeEmployee),
);

export default router;
