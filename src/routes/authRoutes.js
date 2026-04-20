import { Router } from 'express';
import { celebrate } from 'celebrate';
import {
  loginUser,
  logoutUser,
  refreshUserSession,
  registerUser,
} from '../controllers/authController.js';
import {
  loginUserSchema,
  registerUserSchema,
} from '../validations/authValidation.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

router.post('/register', celebrate(registerUserSchema), registerUser);
router.post('/login', celebrate(loginUserSchema), loginUser);
router.post('/logout', authenticate, logoutUser);
router.post('/refresh', refreshUserSession);

export default router;
