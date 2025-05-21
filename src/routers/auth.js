import express from 'express';

import {
  registerController,
  loginController,
  logoutController,
  refreshController,
} from '../controllers/auth.js';

import ctrlWrapper from '../utils/ctrlWrapper.js';

const router = express.Router();

router.post('/register', ctrlWrapper(registerController));
router.post('/login', ctrlWrapper(loginController));
router.post('/logout', ctrlWrapper(logoutController));
router.post('/refresh', ctrlWrapper(refreshController));

export default router;
