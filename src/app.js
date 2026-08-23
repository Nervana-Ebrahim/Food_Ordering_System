import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoSanitize from 'express-mongo-sanitize';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from '../swagger.js';

import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import categoryRoutes from './routes/category.routes.js';
import foodRoutes from './routes/food.routes.js';
import cartRoutes from './routes/cart.routes.js';
import orderRoutes from './routes/order.routes.js';

import notFound from './middleware/notFound.middleware.js';
import errorHandler from './middleware/error.middleware.js';

const app = express();

// Security & core middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize()); // strips $ and . operators from user input to prevent NoSQL injection

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'API is healthy' });
});

// API documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/foods', foodRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

// 404 + centralized error handler (must be registered last)
app.use(notFound);
app.use(errorHandler);

export default app;
