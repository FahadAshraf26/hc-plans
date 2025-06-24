import express from 'express';
const router = express.Router({ mergeParams: true });

import auth from '../Middleware/auth';
import makeExpressCallback from '../Utils/makeExpressCallback';

import IssuerController from '../Controllers/IssuerController';

import container from '@infrastructure/DIContainer/container';

const issuerController = container.get<IssuerController>(IssuerController);

router.get('/', auth, makeExpressCallback(issuerController.getAllIssuersByOwner)); // get all issuers

export default router;
