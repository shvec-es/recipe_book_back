import createHttpError from 'http-errors';
import '../models/category.js';
import { Recipe } from '../models/recipe.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';

export const getAllRecipes = async (req, res, next) => {
  try {
    const { page = 1, perPage = 10, category, search, owner } = req.query;
    const skip = (page - 1) * perPage;

    const filter = {};
    if (owner === 'true' && req.user) {
      filter.userId = req.user._id;
    }
    if (category) {
      filter.category = category;
    }
    if (search) {
      filter.$text = { $search: search };
    }

    const [totalRecipes, recipes] = await Promise.all([
      Recipe.countDocuments(filter),
      Recipe.find(filter)
        .populate('category', 'type')
        .populate('userId', 'name')
        .skip(skip)
        .limit(perPage)
        .sort({ createdAt: -1 }),
    ]);

    const totalPages = Math.ceil(totalRecipes / perPage);

    res.status(200).json({
      recipes,
      totalRecipes,
      page,
      perPage,
      totalPages,
    });
  } catch (err) {
    next(err);
  }
};

export const getRecipeById = async (req, res, next) => {
  try {
    const { recipeId } = req.params;
    console.log(recipeId);
    const recipe = await Recipe.findById(recipeId);

    if (!recipe) {
      throw createHttpError(404, 'Recipe not found');
    }

    res.status(200).json(recipe);
  } catch (err) {
    next(err);
  }
};

export const createRecipe = async (req, res, next) => {
  try {
    if (typeof req.body.ingredients === 'string') {
      req.body.ingredients = JSON.parse(req.body.ingredients);
    }

    if (!req.file) {
      return next(createHttpError(400, 'Recipe image is required'));
    }

    const result = await saveFileToCloudinary(req.file.buffer, 'recipes');

    const recipe = await Recipe.create({
      ...req.body,
      image: result.secure_url || result.url,
      userId: req.user._id,
    });
    res.status(201).json(recipe);
  } catch (err) {
    next(err);
  }
};

export const deleteRecipe = async (req, res, next) => {
  try {
    const { recipeId } = req.params;
    const recipe = await Recipe.findOneAndDelete({
      _id: recipeId,
      userId: req.user._id,
    });

    if (!recipe) {
      throw createHttpError(404, 'Recipe not found');
    }

    res.status(200).json(recipe);
  } catch (err) {
    next(err);
  }
};

export const updateRecipe = async (req, res, next) => {
  try {
    const { recipeId } = req.params;
    const updateData = { ...req.body };

    if (req.file) {
      const result = await saveFileToCloudinary(req.file.buffer, 'recipes');
      updateData.image = result.secure_url || result.url;
    }

    const recipe = await Recipe.findOneAndUpdate(
      { _id: recipeId, userId: req.user._id },
      updateData,
      { returnDocument: 'after' },
    );

    if (!recipe) {
      throw createHttpError(404, 'Recipe not found');
    }

    res.status(200).json(recipe);
  } catch (err) {
    next(err);
  }
};
