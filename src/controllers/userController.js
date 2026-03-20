import createHttpError from 'http-errors';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { User } from '../models/user.js';

export const updateUserAvatar = async (req, res, next) => {
  if (!req.file) {
    throw createHttpError(400, 'No file');
  }
  // У req.file зберігається об’єкт з властивостями:
  //   fieldname — ключ поля у формі (multipart/form-data), яке містить файл.
  //   originalname — початкове ім’я файла, яке надіслав клієнт.
  //   encoding — спосіб кодування під час передавання (зазвичай 7bit).
  //   mimetype — визначений тип вмісту (наприклад, image/png, image/jpeg).
  //   size — фактичний розмір отриманого файлу.
  //   buffer — повний вміст файлу у вигляді Buffer (саме його передаватимемо далі у хмарне сховище).
  // приклад: {
  //   fieldname: 'avatar',            // назва поля у формі
  //   originalname: 'download.jpeg',  // оригінальне ім’я файлу на клієнті
  //   encoding: '7bit',               // тип кодування передавання
  //   mimetype: 'image/jpeg',         // MIME-тип файлу
  //   size: 12345,                    // розмір у байтах
  //   buffer: <Buffer ff d8 ff ...>   // вміст файлу (Buffer)
  // }

  // saveFileToCloudinary завантажує зображення у Cloudinary і повертає об’єкт із даними про файл.
  const result = await saveFileToCloudinary(req.file.buffer);

  const updatedUser = await User.findOneAndUpdate(
    { _id: req.user._id },
    { avatar: result.secure_url }, // безпечне посилання на зображення, яке можна використовувати на фронтенді.
    { returnDocument: 'after' }, // гарантує, що у змінну user потрапить уже оновлений об’єкт користувача.
  );

  if (!updatedUser) {
    throw createHttpError(404, 'User not found');
  }

  res.status(200).json({ url: updatedUser.avatar });
};
