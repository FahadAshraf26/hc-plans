import express from 'express';
import makeExpressCallback from '../Utils/makeExpressCallback';
import container from '@infrastructure/DIContainer/container';
import AdminUpdateAchRefundStatusController from '@http/Controllers/AdminUpdateAchRefundStatusController';
import adminAuth from '@http/Middleware/adminAuth';
import path from 'path';
import multer from 'multer';
const csvPath = path.resolve('./Storage');
const csvUploader = multer({ dest: csvPath });

const adminUpdateAchRefundStatusController = container.get<AdminUpdateAchRefundStatusController>(AdminUpdateAchRefundStatusController);
const router = express.Router({ mergeParams: true });

router.get(
  '/getHistory',
  makeExpressCallback(adminUpdateAchRefundStatusController.getAchRefundStatusUpdateHistory),
)
router.post(
  '/',
  adminAuth,
  csvUploader.single('refundStatus'),
  makeExpressCallback(adminUpdateAchRefundStatusController.UpdateAchRefundStatus),
);


export default router;
