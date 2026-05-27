import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, roleGuard } from '../middleware/auth.middleware';

const router = Router();
const prisma = new PrismaClient();

// All admin routes require SUPER_ADMIN role
router.use(authMiddleware, roleGuard('SUPER_ADMIN'));

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

    // Calculate last 7 days revenue for chart
    const chartData = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const nextD = new Date(d);
      nextD.setDate(nextD.getDate() + 1);

      const dayRevenue = await prisma.order.aggregate({
        where: { createdAt: { gte: d, lt: nextD }, paymentStatus: 'PAID' },
        _sum: { total: true },
      });
      chartData.push({
        day: d.toLocaleDateString('en-US', { weekday: 'short' }),
        revenue: dayRevenue._sum.total || 0,
      });
    }

    return res.json({
      success: true,
      data: {
        totalOrdersToday,
        revenueToday: revenueToday._sum.total || 0,
        totalRestaurants,
        pendingApprovals,
        totalUsers,
        activeRiders,
        revenueChart: chartData
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
        _count: { select: { orders: true, menuItems: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return res.json({ success: true, data: restaurants });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── POST /api/admin/restaurants ─────────────────────────
router.post('/restaurants', async (req: Request, res: Response) => {
  try {
    const { ownerId, name, slug, description, phone, email, addressLine1, city, postcode,
            categories, minOrderValue, deliveryFee, deliveryTimeMins, logoUrl, bannerUrl } = req.body;
    const restaurant = await prisma.restaurant.create({
      data: {
        ownerId, name, slug, description, phone, email, addressLine1, city: city || 'Lahore', postcode: postcode || '00000',
        categories: categories || [], minOrderValue: minOrderValue || 500, deliveryFee: deliveryFee || 150,
        deliveryTimeMins: deliveryTimeMins || 30, logoUrl, bannerUrl, isActive: true,
      },
    });
    return res.status(201).json({ success: true, data: restaurant });
  } catch (err: any) {
    if (err.code === 'P2002') return res.status(400).json({ success: false, message: 'Slug already exists' });
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── PUT /api/admin/restaurants/:id/activate ──────────────
router.put('/restaurants/:id/activate', async (req: Request, res: Response) => {
  try {
    const restaurant = await prisma.restaurant.update({
      where: { id: req.params.id as string },
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
      where: { id: req.params.id as string },
      data: { isActive: false },
    });
    return res.json({ success: true, message: 'Restaurant suspended', data: restaurant });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── DELETE /api/admin/restaurants/:id ────────────────────
router.delete('/restaurants/:id', async (req: Request, res: Response) => {
  try {
    await prisma.restaurant.delete({ where: { id: req.params.id as string } });
    return res.json({ success: true, message: 'Restaurant deleted' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

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

// ─── GET /api/admin/users ─────────────────────────────────
router.get('/users', async (req: Request, res: Response) => {
  try {
    const { role, search, page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const where: any = {};
    if (role) where.role = role;
    else where.role = 'CUSTOMER';
    if (search) where.OR = [
      { fullName: { contains: search as string, mode: 'insensitive' } },
      { email: { contains: search as string, mode: 'insensitive' } },
    ];

    const users = await prisma.user.findMany({
      where,
      select: { id: true, fullName: true, email: true, phone: true, role: true, createdAt: true, isActive: true },
      orderBy: { createdAt: 'desc' },
      skip,
      take: Number(limit),
    });
    const total = await prisma.user.count({ where });
    return res.json({ success: true, data: users, meta: { total, page: Number(page) } });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── GET /api/admin/riders ───────────────────────────────
router.get('/riders', async (_req: Request, res: Response) => {
  try {
    const riders = await prisma.rider.findMany({
      include: {
        user: { select: { fullName: true, email: true, phone: true, profilePhoto: true, isActive: true } },
        _count: { select: { orders: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return res.json({ success: true, data: riders });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── POST /api/admin/riders ──────────────────────────────
router.post('/riders', async (req: Request, res: Response) => {
  try {
    const { userId, vehicleType, vehicleReg } = req.body;
    // Update user role first
    await prisma.user.update({ where: { id: userId }, data: { role: 'RIDER' } });
    const rider = await prisma.rider.create({
      data: { userId, vehicleType, vehicleReg },
      include: { user: { select: { fullName: true, email: true } } },
    });
    return res.status(201).json({ success: true, data: rider });
  } catch (err: any) {
    if (err.code === 'P2002') return res.status(400).json({ success: false, message: 'User is already a rider' });
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── PUT /api/admin/riders/:id/suspend ───────────────────
router.put('/riders/:id/suspend', async (req: Request, res: Response) => {
  try {
    const rider = await prisma.rider.findUnique({ where: { id: req.params.id as string } });
    if (!rider) return res.status(404).json({ success: false, message: 'Rider not found' });
    await prisma.user.update({ where: { id: rider.userId }, data: { isActive: false } });
    return res.json({ success: true, message: 'Rider suspended' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── PUT /api/admin/riders/:id/activate ──────────────────
router.put('/riders/:id/activate', async (req: Request, res: Response) => {
  try {
    const rider = await prisma.rider.findUnique({ where: { id: req.params.id as string } });
    if (!rider) return res.status(404).json({ success: false, message: 'Rider not found' });
    await prisma.user.update({ where: { id: rider.userId }, data: { isActive: true } });
    return res.json({ success: true, message: 'Rider activated' });
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
  } catch (err: any) {
    if (err.code === 'P2002') return res.status(400).json({ success: false, message: 'Coupon code already exists' });
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── PUT /api/admin/coupons/:id ──────────────────────────
router.put('/coupons/:id', async (req: Request, res: Response) => {
  try {
    const coupon = await prisma.coupon.update({
      where: { id: req.params.id as string },
      data: req.body,
    });
    return res.json({ success: true, data: coupon });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── DELETE /api/admin/coupons/:id ───────────────────────
router.delete('/coupons/:id', async (req: Request, res: Response) => {
  try {
    await prisma.coupon.delete({ where: { id: req.params.id as string } });
    return res.json({ success: true, message: 'Coupon deleted' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── GET /api/admin/reports/revenue ──────────────────────
router.get('/reports/revenue', async (req: Request, res: Response) => {
  try {
    const { period = '7d' } = req.query;
    const days = period === '30d' ? 30 : period === '90d' ? 90 : 7;
    const from = new Date();
    from.setDate(from.getDate() - days);

    const orders = await prisma.order.findMany({
      where: { createdAt: { gte: from }, status: 'DELIVERED' },
      select: { total: true, createdAt: true, subtotal: true, deliveryFee: true },
      orderBy: { createdAt: 'asc' },
    });

    // Group by date
    const byDate: Record<string, { revenue: number; orders: number }> = {};
    for (const order of orders) {
      const date = order.createdAt.toISOString().split('T')[0];
      if (!byDate[date]) byDate[date] = { revenue: 0, orders: 0 };
      byDate[date].revenue += order.total;
      byDate[date].orders += 1;
    }

    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
    const totalOrders = orders.length;

    return res.json({
      success: true,
      data: {
        chart: Object.entries(byDate).map(([date, val]) => ({ date, ...val })),
        totalRevenue,
        totalOrders,
        avgOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

export { router as adminRouter };
