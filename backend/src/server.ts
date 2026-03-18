import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { authRouter } from './routes/auth.routes';
import { restaurantRouter } from './routes/restaurant.routes';
import { orderRouter } from './routes/order.routes';
import { adminRouter } from './routes/admin.routes';
import { uploadRouter } from './routes/upload.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ───────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Health Check ─────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'OK', message: 'Order.pk API is running!', timestamp: new Date() });
});

// ─── Routes ───────────────────────────────────────────────
app.use('/api/auth', authRouter);
app.use('/api/restaurants', restaurantRouter);
app.use('/api/orders', orderRouter);
app.use('/api/admin', adminRouter);
app.use('/api/upload', uploadRouter);

// ─── 404 Handler ──────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ─── Error Handler ────────────────────────────────────────
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// ─── Start Server ─────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 Order.pk API running on http://localhost:${PORT}`);
  console.log(`📦 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔗 Health: http://localhost:${PORT}/api/health\n`);
});

export default app;
