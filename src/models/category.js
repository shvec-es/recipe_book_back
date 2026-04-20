import { model, Schema } from 'mongoose';

const categorySchema = new Schema(
  {
    type: {
      type: String,
      required: [true, 'Назва категорії обов’язкова'],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
  },
  { timestamps: true },
);

export const Category = model('Category', categorySchema);
