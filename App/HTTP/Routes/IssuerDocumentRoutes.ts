import express from 'express';
const router = express.Router({ mergeParams: true });

import uploadFile from '../Middleware/UploadFile';
import makeExpressCallback from '../Utils/makeExpressCallback';
import container from '@infrastructure/DIContainer/container';
import IssuerDocumentController from '@controller/IssuerDocumentController';

const issuerDocumentController = container.get<IssuerDocumentController>(
  IssuerDocumentController,
);

router.get('/', makeExpressCallback(issuerDocumentController.getIssuerDocuments));
router.post(
  '/',

  uploadFile.single('issuerDocument'),
  makeExpressCallback(issuerDocumentController.createIssuerDocument),
);
router.get(
  '/:issuerDocumentId',

  makeExpressCallback(issuerDocumentController.findIssuerDocument),
);
router.put(
  '/:issuerDocumentId',

  uploadFile.single('issuerDocument'),
  makeExpressCallback(issuerDocumentController.updateIssuerDocument),
);
router.delete(
  '/:issuerDocumentId',

  makeExpressCallback(issuerDocumentController.removeIssuerDocument),
);

export default router;
