import container from '@infrastructure/DIContainer/container';
import express from 'express';
const router = express.Router({ mergeParams: true });

import IssuerBankRoutes from './IssuerBankRoutes';
import IssuerDocumentRoutes from './IssuerDocumentRoutes';
import IssuerEmployeeRoutes from './IssuerEmployeeRoutes';
import IssuerController from '../Controllers/IssuerController';
import IssuerContactRoutes from './IssuerContactRoutes';
import adminAuth from '../Middleware/adminAuth';
import auth from '../Middleware/auth';
import makeExpressCallback from '../Utils/makeExpressCallback';
import EmployeeLogController from '@http/Controllers/EmployeeLogController';

const issuerController = container.get<IssuerController>(IssuerController);
const employeeLogController = container.get<EmployeeLogController>(EmployeeLogController);

router.get('/', adminAuth, makeExpressCallback(issuerController.getAllIssuers)); // get all issuers
router.get('/:issuerId', auth, makeExpressCallback(issuerController.findIssuer)); // find an issuer by issuerId
router.get("/:dwollaCustomerId/getDwollaBeneficialOwner", adminAuth, makeExpressCallback(issuerController.getDwollaBeneficialOwner)); 
router.put('/:issuerId', adminAuth, makeExpressCallback(issuerController.updateIssuer));// update an issuer
router.put("/:customerId/updateCustomer", adminAuth, makeExpressCallback(issuerController.updateCustomer));
router.put("/:customerId/updateBusinessCustomer", adminAuth, makeExpressCallback(issuerController.updateBusinessCustomer));
router.put("/:customerId/updateBusinessCustomerDwollaBalanceId", adminAuth, makeExpressCallback(issuerController.updateBusinessCustomerDwollaBalanceId));
router.delete(
  '/:issuerId',
  adminAuth,
  makeExpressCallback(issuerController.removeIssuer),
); // delete an issuer
router.post('/', adminAuth, makeExpressCallback(issuerController.createIssuer)); // create an issuer
router.post('/:issuerId/employeeCount', adminAuth, makeExpressCallback(employeeLogController.addEmployeeLog));
router.post(
  '/:issuerId/retryDwollaBusiness/:customerId',
  adminAuth,
  makeExpressCallback(issuerController.retryDwollaBusiness),
); // retry dwolla business

router.use('/:issuerId/banks', IssuerBankRoutes);
router.use('/:issuerId/documents', adminAuth, IssuerDocumentRoutes);

router.get(
  '/:issuerId/info',
  adminAuth,
  makeExpressCallback(issuerController.GetIssuerInfo),
);

router.use('/:issuerId/employees', adminAuth, IssuerEmployeeRoutes);
router.use('/:issuerId/contacts', adminAuth, IssuerContactRoutes);

export default router;
