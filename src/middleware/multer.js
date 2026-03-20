import multer from 'multer';

export const upload = multer({
  storage: multer.memoryStorage(), // зберігаємо файл у пам’яті сервера (не на диску).
  limits: {
    fileSize: 2 * 1024 * 1024, // обмежуємо розмір завантаження до 2 МБ.
  },
  fileFilter: (req, file, cb) => {
    // fileFilter — це функція, яку multer викликає для кожного завантаженого файлу. Вона отримує три аргументи:
    // req — HTTP-запит, як у звичайному Express;
    // file — інформація про файл (назва, MIME-тип, розмір тощо);
    // cb — callback, який повідомляє multer, що робити з файлом.

    // визначаємо, які файли дозволено приймати. У цьому випадку — лише ті, чий mimetype починається з image/.
    if (file.mimetype.startsWith('image/')) {
      cb(null, true); // файл дозволено (приймаємо);
    } else {
      cb(
        // файл відхилено з помилкою, обробка переривається.
        new Error('Only images allowed'),
        false,
      );
    }
    // 3й варіант - cb(null, false) — файл відхилено без помилки;
  },
});
