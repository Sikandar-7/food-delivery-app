import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, roleGuard } from '../middleware/auth.middleware';

const router = Router();
const prisma = new PrismaClient();

// All admin routes require SUPER_ADMIN role
router.use(authMiddleware, roleGuard('SUPER_ADMIN'));

// ─── GET /api/admin/orders ───────────────────────────────
router.get('/orders', async (req: Request, res: Response) => {
  try {
    const { status, from, to, page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const where: any = {};
    if (status) where.status = status;
    if (from && to) where.createdAt = { gte: new Date(from as string), lte: new Date(to as string) };

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: Number(limit),
        include: {
          customer: { select: { fullName: true, email: true } },
          restaurant: { select: { name: true } },
          rider: { include: { user: { select: { fullName: true } } } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.order.count({ where }),
    ]);

    return res.json({ success: true, data: orders, meta: { total, page: Number(page) } });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── GET /api/admin/dashboard/stats ──────────────────────
router.get('/dashboard/stats', async (_req: Request, res: Response) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [
      totalOrdersToday,
      revenueToday,
      totalRestaurants,
      pendingApprovals,
      totalUsers,
      activeRiders,
    ] = await Promise.all([
      prisma.order.count({ where: { createdAt: { gte: today, lt: tomorrow } } }),
      prisma.order.aggregate({
        where: { createdAt: { gte: today, lt: tomorrow }, paymentStatus: 'PAID' },
        _sum: { total: true },
      }),
      prisma.restaurant.count({ where: { isActive: true } }),
      prisma.restaurant.count({ where: { isActive: false } }),
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      prisma.rider.count({ where: { isOnline: true } }),
    ]);

    return res.json({
      success: true,
      data: {
        totalOrdersToday,
        revenueToday: revenueToday._sum.total || 0,
        totalRestaurants,
        pendingApprovals,
        totalUsers,
        activeRiders,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── GET /api/admin/restaurants ───────────────────────────
router.get('/restaurants', async (_req: Request, res: Response) => {
  try {
    const restaurants = await prisma.restaurant.findMany({
      include: {
        owner: { select: { fullName: true, email: true } },
        _count: { select: { orders: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return res.json({ success: true, data: restaurants });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── PUT /api/admin/restaurants/:id/activate ──────────────
router.put('/restaurants/:id/activate', async (req: Request, res: Response) => {
  try {
    const restaurant = await prisma.restaurant.update({
      where: { id: req.params.id },
      data: { isActive: true },
    });
    return res.json({ success: true, message: 'Restaurant activated', data: restaurant });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── PUT /api/admin/restaurants/:id/suspend ───────────────
router.put('/restaurants/:id/suspend', async (req: Request, res: Response) => {
  try {
    const restaurant = await prisma.restaurant.update({
      where: { id: req.params.id },
      data: { isActive: false },
    });
    return res.json({ success: true, message: 'Restaurant suspended', data: restaurant });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── GET /api/admin/users ─────────────────────────────────
router.get('/users', async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      where: { role: 'CUSTOMER' },
      select: { id: true, fullName: true, email: true, phone: true, createdAt: true, isActive: true },
      orderBy: { createdAt: 'desc' },
    });
    return res.json({ success: true, data: users });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── GET /api/admin/coupons ───────────────────────────────
router.get('/coupons', async (_req: Request, res: Response) => {
  try {
    const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } });
    return res.json({ success: true, data: coupons });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── POST /api/admin/coupons ──────────────────────────────
router.post('/coupons', async (req: Request, res: Response) => {
  try {
    const coupon = await prisma.coupon.create({ data: req.body });
    return res.status(201).json({ success: true, data: coupon });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

export { router as adminRouter };
