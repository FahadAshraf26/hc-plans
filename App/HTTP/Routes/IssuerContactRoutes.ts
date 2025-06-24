import express from 'express';
const router = express.Router({ mergeParams: true });

import container from '../../Infrastructure/DIContainer/container';
import makeExpressCallback from '../Utils/makeExpressCallback';
import ContactController from '@http/Controllers/ContactController';

const contactController = container.get<ContactController>(ContactController);

router.get('/', makeExpressCallback(contactController.getContacts));
router.get('/:contactId', makeExpressCallback(contactController.findContact));
router.post('/', makeExpressCallback(contactController.createContact));
router.put('/:contactId', makeExpressCallback(contactController.updateContact));
router.delete('/:contactId', makeExpressCallback(contactController.removeContact));

export default router;
