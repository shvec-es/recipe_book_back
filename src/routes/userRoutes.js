import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';
import {
  getCurrentUser,
  updateUserProfile,
  getUserPublicInfo,
  getUserRecipes,
} from '../controllers/userController.js';
import { upload } from '../middleware/multer.js';

const router = Router();

router.get('/me', authenticate, getCurrentUser);
router.patch('/me', authenticate, upload.single('avatar'), updateUserProfile);

router.get('/:userId', getUserPublicInfo);
router.get('/:userId/recipes', getUserRecipes);

export default router;
