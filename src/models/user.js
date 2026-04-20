import { model, Schema } from 'mongoose';

const userSchema = new Schema(
  {
    username: { type: String, required: true, trim: true },
    email: { type: String, unique: true, required: true, trim: true },
    password: { type: String, required: true },
    avatar: {
      type: String,
      required: false,
      default: 'https://ac.goit.global/fullstack/react/default-avatar.jpg',
    },
  },
  { timestamps: true },
);

// видаляємо пароль з відповіді, щоб не повертати його клієнту, це небезпечно
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export const User = model('User', userSchema);
