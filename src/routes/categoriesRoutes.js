import { Router } from 'express';
import { getCategories } from '../controllers/categoriesController.js';

const router = Router();

router.use('/', getCategories);

export default router;
