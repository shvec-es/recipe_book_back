import { Schema, model } from 'mongoose';

const recipeSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    ingredients: [
      {
        name: String,
        amount: String,
        _id: false,
      },
    ],
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    image: { type: String },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

recipeSchema.index({ title: 'text', description: 'text' });

// створимо модель нотатки
export const Recipe = model('Recipe', recipeSchema);
