import express from 'express';
const router = express.Router({ mergeParams: true });

import PLController from '../Controllers/CampaignPLController';
import auth from '../Middleware/auth';
import adminAuth from '../Middleware/adminAuth';
import makeExpressCallback from '../Utils/makeExpressCallback';
import container from '../../Infrastructure/DIContainer/container';

const plController = container.get<PLController>(PLController);

router.get('/', makeExpressCallback(plController.getPL));
router.get('/:plId', auth, makeExpressCallback(plController.findPL));
router.put('/:plId', adminAuth, makeExpressCallback(plController.updatePL));
router.delete('/:plId', adminAuth, makeExpressCallback(plController.removePL));
router.post('/', adminAuth, makeExpressCallback(plController.createPL));

export default router;
