import makeExpressCallback from '@http/Utils/makeExpressCallback';
import express from 'express';
import container from '@infrastructure/DIContainer/container';
import adminAuth from '@http/Middleware/adminAuth';
import NorthCapitalDocumentController from '@controller/NorthCapitalDocumentController';
const router = express.Router({ mergeParams: true });

const northCapitalDocumentController = container.get<NorthCapitalDocumentController>(
  NorthCapitalDocumentController,
);

router.get(
  '/',
  adminAuth,
  makeExpressCallback(northCapitalDocumentController.getAllNorthCapitalDocuments),
);
export default router;
