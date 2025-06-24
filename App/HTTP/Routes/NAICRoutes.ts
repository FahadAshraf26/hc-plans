import express from 'express';
const router = express.Router({ mergeParams: true });
import NAICController from '@controller/NAICController';
import adminAuth from '../Middleware/adminAuth';
import makeExpressCallback from '../Utils/makeExpressCallback';
import container from '@infrastructure/DIContainer/container';

const naicController = container.get<NAICController>(NAICController);

router.post('/', adminAuth, makeExpressCallback(naicController.createNAIC));
router.get('/', adminAuth, makeExpressCallback(naicController.getNAIC));
router.get('/:naicId', adminAuth, makeExpressCallback(naicController.findNAIC));
router.put('/:naicId', adminAuth, makeExpressCallback(naicController.updateNAIC));
router.delete('/:naicId', adminAuth, makeExpressCallback(naicController.removeNAIC));

export default router;
