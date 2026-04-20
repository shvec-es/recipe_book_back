import { Joi, Segments } from 'celebrate';

export const registerUserSchema = {
  [Segments.BODY]: Joi.object({
    username: Joi.string().min(2).max(30).required().messages({
      'any.required': 'Ім’я користувача є обов’язковим',
    }),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required().messages({
      'string.min': 'Пароль має бути не менше 8 символів',
    }),
  }),
};

export const loginUserSchema = {
  [Segments.BODY]: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};

export const requestResetEmailSchema = {
  [Segments.BODY]: Joi.object({
    email: Joi.string().email().required(),
  }),
};

export const resetPasswordSchema = {
  [Segments.BODY]: Joi.object({
    password: Joi.string().min(8).required(),
    token: Joi.string().required(),
  }),
};
