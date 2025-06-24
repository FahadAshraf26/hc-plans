import LoanwellController from '@http/Controllers/LoanwellController';
import adminAuth from '@http/Middleware/adminAuth';
import makeExpressCallback from '@http/Utils/makeExpressCallback';
import container from '@infrastructure/DIContainer/container';
import express from 'express';
import path from 'path';
import multer from 'multer';

const csvPath = path.resolve('./Storage');
const csvUploader = multer({ dest: csvPath });
const router = express.Router({ mergeParams: true });

const loanwellController = container.get<LoanwellController>(LoanwellController);

router.post(
  '/',
  adminAuth,
  csvUploader.array('loanwellFiles'),
  makeExpressCallback(loanwellController.addLoanwellImport),
);
router.post(
  '/importData',
  adminAuth,
  makeExpressCallback(loanwellController.importLoanwellData),
);
router.get('/businessNames', adminAuth, makeExpressCallback(loanwellController.fetchLoanwellBusinessNames));
router.get('/', adminAuth, makeExpressCallback(loanwellController.fetchLoanwellData));

export default router;
