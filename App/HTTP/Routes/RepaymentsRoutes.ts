import express from 'express';
const router = express.Router({ mergeParams: true });

import RepaymentsController from '@http/Controllers/RepaymentsController';
import container from '@infrastructure/DIContainer/container';
import makeExpressCallback from '../Utils/makeExpressCallback';
import auth from '@http/Middleware/auth';
import path from 'path';
import adminAuth from '@http/Middleware/adminAuth';
import multer from 'multer';
const csvPath = path.resolve('./Storage');
const csvUploader = multer({ dest: csvPath });
const repaymentController = container.get<RepaymentsController>(RepaymentsController);

router.get(
  '/investorRepayments',
  auth,
  makeExpressCallback(repaymentController.getAllInvestorRepayments),
);

router.get('/allRepayments', adminAuth, makeExpressCallback(repaymentController.getInvestorsRepayments))

router.post(
  '/uploadRepayments',
  adminAuth,
  csvUploader.single('investorRepayments'),
  makeExpressCallback(repaymentController.uploadRepayments),
);

router.put(
  '/deleteRepayments',
  adminAuth,
  makeExpressCallback(repaymentController.deleteAllRepayments)
)

router.get(
  '/getUploadRepaymentsTemplate',
  adminAuth,
  makeExpressCallback(repaymentController.getUploadRepaymentsTemplate)
)

export default router;
