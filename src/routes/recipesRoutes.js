import { Router } from 'express';
import { celebrate } from 'celebrate';
import { authenticate } from '../middleware/authenticate.js';
import {
  createRecipeSchema,
  getAllRecipesSchema,
  recipeIdSchema,
  updateRecipeSchema,
} from '../validations/recipesValidation.js';
import {
  createRecipe,
  deleteRecipe,
  getAllRecipes,
  getRecipeById,
  updateRecipe,
} from '../controllers/recipesController.js';
import { upload } from '../middleware/multer.js';

const router = Router();

// публічні роути
router.get('/', celebrate(getAllRecipesSchema), getAllRecipes);
router.get('/:recipeId', celebrate(recipeIdSchema), getRecipeById);

// приватні роути
router.use(authenticate);

router.post(
  '/',
  upload.single('image'),
  celebrate(createRecipeSchema),
  createRecipe,
);
router.patch(
  '/:recipeId',
  upload.single('image'),
  celebrate(updateRecipeSchema),
  updateRecipe,
);
router.delete('/:recipeId', celebrate(recipeIdSchema), deleteRecipe);

export default router;
