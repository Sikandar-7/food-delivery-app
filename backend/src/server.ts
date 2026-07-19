import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { authRouter } from './routes/auth.routes';
import { restaurantRouter } from './routes/restaurant.routes';
import { orderRouter } from './routes/order.routes';
import { adminRouter } from './routes/admin.routes';
import { uploadRouter } from './routes/upload.routes';
import { riderRouter } from './routes/rider.routes';
import { securityHeaders, rateLimit } from './middleware/security.middleware';
import { prisma } from './lib/prisma';

dotenv.config();

// ─── Fail fast if critical secrets are missing (don't boot half-configured) ──
const REQUIRED_ENV = ['JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET', 'DATABASE_URL'];
const missingEnv = REQUIRED_ENV.filter((k) => !process.env[k]);
if (missingEnv.length > 0) {
  throw new Error(`Missing required environment variables: ${missingEnv.join(', ')}`);
}

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ───────────────────────────────────────────
app.use(securityHeaders);
// FRONTEND_URL may hold several comma-separated origins. Vercel serves a project
// from more than one hostname (production alias + a -git-<branch>- preview alias),
// and every one of them needs to be allowed or the browser blocks the request.
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:3000')
  .split(',')
  .map((o) => o.trim().replace(/\/$/, ''))
  .filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    // allow non-browser clients (curl, server-to-server) with no Origin header
    if (!origin) return cb(null, true);
    const clean = origin.replace(/\/$/, '');
    if (allowedOrigins.includes(clean)) return cb(null, true);
    // in dev, allow any localhost port (3000, 3011, …) so previews just work
    if (process.env.NODE_ENV !== 'production' && /^http:\/\/localhost:\d+$/.test(clean)) return cb(null, true);
    // Deny by omitting the CORS header — throwing here would surface as a 500
    return cb(null, false);
  },
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Throttle auth endpoints (brute-force protection): 10 requests / minute / IP
const authLimiter = rateLimit({ windowMs: 60_000, max: 10, message: 'Too many attempts. Please wait a minute and try again.' });

// ─── Health Check ─────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'OK', message: 'Order.pk API is running!', timestamp: new Date() });
});

// ─── Routes ───────────────────────────────────────────────
app.use('/api/auth', authLimiter, authRouter);
app.use('/api/restaurants', restaurantRouter);
app.use('/api/orders', orderRouter);
app.use('/api/admin', adminRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/rider', riderRouter);

// ─── Public: Coupon Validate ──────────────────────────────
app.get('/api/coupons/validate/:code', async (req: express.Request, res: express.Response) => {
  try {
    const coupon = await prisma.coupon.findUnique({
      where: { code: (req.params.code as string).toUpperCase() },
    });
    if (!coupon || !coupon.isActive) {
      return res.status(404).json({ success: false, message: 'Coupon not found or inactive' });
    }
    if (new Date() < coupon.validFrom || new Date() > coupon.validTo) {
      return res.status(400).json({ success: false, message: 'Coupon has expired' });
    }
    return res.json({ success: true, data: coupon });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

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
if (process.env.NODE_ENV !== 'production' && process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`\n🚀 Order.pk API running on http://localhost:${PORT}`);
    console.log(`📦 Environment: ${process.env.NODE_ENV}`);
    console.log(`🔗 Health: http://localhost:${PORT}/api/health\n`);
  });
}

export default app;
module.exports = app;
