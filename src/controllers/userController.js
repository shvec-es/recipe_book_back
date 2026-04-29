import createHttpError from 'http-errors';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { User } from '../models/user.js';
import { Recipe } from '../models/recipe.js';
import { isValidObjectId } from 'mongoose';

export const getCurrentUser = async (req, res, next) => {
  try {
    const user = req.user;

    if (!user) {
      return next(createHttpError(404, 'User not found'));
    }

    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserProfile = async (req, res, next) => {
  try {
    const { username } = req.body;
    const updateData = {};

    if (username) updateData.username = username;

    if (req.file) {
      const result = await saveFileToCloudinary(req.file.buffer, 'avatars');
      updateData.avatar = result.secure_url;
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: req.user._id },
      updateData,
      { returnDocument: 'after' },
    );

    if (!updatedUser) {
      throw createHttpError(404, 'User not found');
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

export const getUserPublicInfo = async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (!isValidObjectId(userId)) {
      return next(createHttpError(400, 'Invalid User ID'));
    }

    const user = await User.findById(userId).select('username avatar');

    if (!user) {
      throw createHttpError(404, 'User not found');
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const getUserRecipes = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { page = 1, perPage = 10 } = req.query;

    if (!isValidObjectId(userId)) {
      return next(createHttpError(400, 'Invalid User ID'));
    }

    const recipes = await Recipe.find({ userId })
      .limit(perPage * 1)
      .skip((page - 1) * perPage)
      .sort({ createdAt: -1 }); // Нові рецепти будуть зверху

    const count = await Recipe.countDocuments({ userId });

    res.status(200).json({
      recipes,
      totalPages: Math.ceil(count / perPage),
      currentPage: page,
      totalRecipes: count,
    });
  } catch (error) {
    next(error);
  }
};
