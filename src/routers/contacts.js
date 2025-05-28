import express from 'express';
import {
  getAllContactsController,
  getContactByIdController,
  addContactController,
  removeContactController,
  updateContactController,
 
} from '../controllers/contacts.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import authenticate from '../middlewares/authenticate.js';

const router = express.Router();

router.use(authenticate);

router.get('/', ctrlWrapper(getAllContactsController));
router.get('/:id', ctrlWrapper(getContactByIdController));
router.post('/', ctrlWrapper(addContactController));
router.patch('/:id', ctrlWrapper(updateContactController));
router.delete('/:id', ctrlWrapper(removeContactController));

export default router;
