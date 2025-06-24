import express from 'express';
const router = express.Router({ mergeParams: true });

import IssueController from '../Controllers/IssueController';
import makeExpressCallback from '../Utils/makeExpressCallback';
import userAuth from '../Middleware/auth';
import container from '../../Infrastructure/DIContainer/container';

const issueController = container.get<IssueController>(IssueController);

router.post('/', userAuth, makeExpressCallback(issueController.addIssue));

export default router;
