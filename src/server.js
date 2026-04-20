import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'node:path';

import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { errors } from 'celebrate';
import cookieParser from 'cookie-parser';

import { connectMongoDB } from './db/connectMongoDB.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { logger } from './middleware/logger.js';

import authRoutes from './routes/authRoutes.js';
import recipesRoutes from './routes/recipesRoutes.js';
import categoriesRoutes from './routes/categoriesRoutes.js';
import userRoutes from './routes/userRoutes.js';

const swaggerDocument = YAML.load(path.resolve('swagger.yaml'));

const app = express();
// Використовуємо значення з .env або дефолтний порт 3000
const PORT = process.env.PORT ?? 3000;

// Для гарного відображення в терміналі
app.use(logger);
// Middleware для парсингу JSON
app.use(express.json());
// Дозволяє запити з будь-яких джерел
app.use(cors());
app.use(cookieParser());

// підключаємо маршрути
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipesRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/users', userRoutes);

// Middleware 404
app.use(notFoundHandler);
// обробка помилок від celebrate (валідація)
app.use(errors());
// Middleware для обробки помилок
app.use(errorHandler);

// підключення до MongoDB
await connectMongoDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
