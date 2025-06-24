import express from 'express';
const router = express.Router({ mergeParams: true });

import InvitationController from '../Controllers/InvitationController';
import container from '@infrastructure/DIContainer/container';
import auth from '../Middleware/auth';
import makeExpressCallback from '../Utils/makeExpressCallback';

const invitationController = container.get<InvitationController>(InvitationController);

router.post('/', auth, makeExpressCallback(invitationController.createInvitation));
router.get('/', auth, makeExpressCallback(invitationController.getInvitations));
router.get(
  '/:invitationId',
  auth,
  makeExpressCallback(invitationController.findInvitation),
);
router.put(
  '/:invitationId',
  auth,
  makeExpressCallback(invitationController.updateInvitation),
);
router.delete(
  '/:invitationId',
  auth,
  makeExpressCallback(invitationController.removeInvitation),
);

export default router;
