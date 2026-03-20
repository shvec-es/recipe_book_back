import multer from 'multer';

export const upload = multer({
  storage: multer.memoryStorage(), // зберігаємо файл у пам’яті сервера (не на диску).
  limits: {
    fileSize: 2 * 1024 * 1024, // обмежуємо розмір завантаження до 2 МБ.
  },
  fileFilter: (req, file, cb) => {
    // визначаємо, які файли дозволено приймати. У цьому випадку — лише ті, чий mimetype співпадає із можливими значеннями.
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
    ];

    // fileFilter — це функція, яку multer викликає для кожного завантаженого файлу. Вона отримує три аргументи:
    // req — HTTP-запит, як у звичайному Express;
    // file — інформація про файл (назва, MIME-тип, розмір тощо);
    // cb — callback, який повідомляє multer, що робити з файлом.

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true); // файл дозволено (приймаємо);
    } else {
      cb(
        // файл відхилено з помилкою, обробка переривається.
        new Error(
          'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.',
        ),
        false,
      );
    }
    // 3й варіант - cb(null, false) — файл відхилено без помилки;
  },
});
