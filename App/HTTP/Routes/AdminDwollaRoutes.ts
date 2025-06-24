import express from 'express';
import AdminDwollaController from '@controller/AdminDwollaController';
import makeExpressCallback from '../Utils/makeExpressCallback';
import container from '@infrastructure/DIContainer/container';
import path from 'path';
import multer from 'multer';

const csvPath = path.resolve('./Storage');
const csvUploader = multer({ dest: csvPath });

const adminDwollaController = container.get<AdminDwollaController>(AdminDwollaController);
const router = express.Router({ mergeParams: true });

router.post(
  '/verification',
  csvUploader.single('document'),
  makeExpressCallback(adminDwollaController.uploadVerificationDocument),
);

router.post(
  '/addDwollaBank',
  makeExpressCallback(adminDwollaController.addFundingSource),
);

router.post(
  '/ownerVerification',
  csvUploader.single('document'),
  makeExpressCallback(adminDwollaController.uploadOwnerVerificationDocuments),
);

router.post('/addBeneficialOwner', makeExpressCallback(adminDwollaController.addBeneficialOwner));

router.post(
  '/updateOwner',
  makeExpressCallback(adminDwollaController.updateBeneficialOwner),
);

router.post('/refundDwollaTransactionToBusinessBank', makeExpressCallback(adminDwollaController.refundDwollaTransactionToBusinessBank));

router.get(
  '/getTransaction',
  makeExpressCallback(adminDwollaController.getSingleTransaction),
);

router.delete(
  '/deleteOwner/:dwollaBeneficialOwnerId',
  makeExpressCallback(adminDwollaController.deleteDwollaBeneficialOwner),
);

export default router;
