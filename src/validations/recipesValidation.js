import { Joi, Segments } from 'celebrate';
import { isValidObjectId } from 'mongoose';

const objectIdValidator = (value, helpers) => {
  return !isValidObjectId(value) ? helpers.message('Invalid id format') : value;
};

const parseJson = (value, helpers) => {
  try {
    return JSON.parse(value);
  } catch {
    return helpers.error('any.invalid');
  }
};

export const getAllRecipesSchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().min(1).default(1),
    perPage: Joi.number().min(5).max(20).default(10),
    category: Joi.string().custom(objectIdValidator),
    search: Joi.string().trim().allow(''),
  }),
};

export const recipeIdSchema = {
  [Segments.PARAMS]: Joi.object({
    recipeId: Joi.string().custom(objectIdValidator).required(),
  }),
};

export const createRecipeSchema = {
  [Segments.BODY]: Joi.object({
    title: Joi.string().min(3).max(100).required().messages({
      'string.base': 'Title must be a string',
      'string.min': 'Title should have at least {#limit} characters',
      'string.max': 'Title should have no more {#limit} characters',
      'any.required': 'Title is required',
    }),
    description: Joi.string().min(20).required().messages({
      'string.base': 'Description must be a string',
      'string.min': 'Description should have at least {#limit} characters',
      'any.required': 'Description is required',
    }),
    category: Joi.string().custom(objectIdValidator).required(),
    ingredients: Joi.custom(parseJson).required(),
    // image: Joi.string().uri().required().messages({
    //   'any.required': 'Фото рецепту є обов’язковим',
    //   'string.uri': 'Посилання на фото має бути коректним URL',
    // }),
  }),
};

export const updateRecipeSchema = {
  [Segments.PARAMS]: Joi.object({
    recipeId: Joi.string().custom(objectIdValidator).required(),
  }),
  [Segments.BODY]: Joi.object({
    title: Joi.string().messages({
      'string.base': 'Title must be a string',
    }),
    description: Joi.string().messages({
      'string.base': 'Description must be a string',
    }),
    category: Joi.string().custom(objectIdValidator),
    ingredients: Joi.array().items(
      Joi.object({
        name: Joi.string().required(),
        amount: Joi.string().required(),
      }),
    ),
    image: Joi.string().uri().messages({
      'string.uri': 'Посилання на фото має бути коректним URL',
    }),
  }).min(1),
};
