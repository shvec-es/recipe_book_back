import { Readable } from 'node:stream';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  secure: true,
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function saveFileToCloudinary(buffer, folder) {
  // функція обгорнута у проміс, щоб можна було зручно використовувати await. Якщо завантаження успішне — повертається результат з усією інформацією про файл (наприклад, secure_url), якщо помилка — вона передається у reject.
  return new Promise((resolve, reject) => {
    // створюється стрім для завантаження, куди можна передати вміст файлу.
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `recipe-book-app/${folder}`, // така папка має бути створена у Cloudinary, в ній будуть завантажені картинки
        resource_type: 'image',
        overwrite: true,
        unique_filename: false,
        use_filename: true,
      },
      (err, result) => (err ? reject(err) : resolve(result)),
    );
    // перетворює Buffer з пам’яті у потік, який відправляється у Cloudinary.
    Readable.from(buffer).pipe(uploadStream);
  });
}
