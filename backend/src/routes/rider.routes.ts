import { Router, Response } from 'express';
import { prisma } from '../lib/prisma';
import { authMiddleware, roleGuard, AuthRequest } from '../middleware/auth.middleware';

const router = Router();

// All rider routes require authentication
router.use(authMiddleware);

// ─── PUT /api/rider/status (toggle online/offline) ────────
router.put('/status', roleGuard('RIDER'), async (req: AuthRequest, res: Response) => {
  try {
    const { isOnline } = req.body;
    const rider = await prisma.rider.update({
      where: { userId: req.user!.id },
      data: { isOnline },
    });
    return res.json({ success: true, data: rider });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── PUT /api/rider/location (update GPS every 30s) ───────
router.put('/location', roleGuard('RIDER'), async (req: AuthRequest, res: Response) => {
  try {
    const { latitude, longitude } = req.body;
    const rider = await prisma.rider.update({
      where: { userId: req.user!.id },
      data: { currentLat: latitude, currentLng: longitude },
    });
    return res.json({ success: true, data: rider });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── GET /api/rider/current-order ─────────────────────────
router.get('/current-order', roleGuard('RIDER'), async (req: AuthRequest, res: Response) => {
  try {
    const rider = await prisma.rider.findUnique({ where: { userId: req.user!.id } });
    if (!rider) return res.status(404).json({ success: false, message: 'Rider not found' });

    const order = await prisma.order.findFirst({
      where: {
        riderId: rider.id,
        status: { in: ['ACCEPTED', 'PREPARING', 'READY', 'ON_THE_WAY'] },
      },
      include: {
        restaurant: { select: { name: true, addressLine1: true, phone: true, latitude: true, longitude: true } },
        customer: { select: { fullName: true, phone: true } },
        items: { include: { menuItem: { select: { name: true } } } },
      },
    });

    return res.json({ success: true, data: order });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── PUT /api/rider/orders/:id/status ─────────────────────
router.put('/orders/:id/status', roleGuard('RIDER'), async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ['ON_THE_WAY', 'DELIVERED'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status for rider' });
    }

    const order = await prisma.order.update({
      where: { id: req.params.id as string },
      data: {
        status,
        ...(status === 'DELIVERED' ? { deliveredAt: new Date(), paymentStatus: 'PAID' } : {}),
      },
    });
    return res.json({ success: true, data: order });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── GET /api/rider/earnings ──────────────────────────────
router.get('/earnings', roleGuard('RIDER'), async (req: AuthRequest, res: Response) => {
  try {
    const rider = await prisma.rider.findUnique({ where: { userId: req.user!.id } });
    if (!rider) return res.status(404).json({ success: false, message: 'Rider not found' });

    // Today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // This month
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    const [todayOrders, monthOrders, totalOrders] = await Promise.all([
      prisma.order.findMany({
        where: { riderId: rider.id, status: 'DELIVERED', deliveredAt: { gte: today, lt: tomorrow } },
        select: { deliveryFee: true, orderNumber: true, deliveredAt: true },
      }),
      prisma.order.aggregate({
        where: { riderId: rider.id, status: 'DELIVERED', deliveredAt: { gte: monthStart } },
        _sum: { deliveryFee: true },
        _count: { id: true },
      }),
      prisma.order.aggregate({
        where: { riderId: rider.id, status: 'DELIVERED' },
        _sum: { deliveryFee: true },
        _count: { id: true },
      }),
    ]);

    return res.json({
      success: true,
      data: {
        todayEarnings: todayOrders.reduce((sum, o) => sum + (o.deliveryFee || 0), 0),
        todayDeliveries: todayOrders.length,
        monthEarnings: monthOrders._sum.deliveryFee || 0,
        monthDeliveries: monthOrders._count.id,
        totalEarnings: totalOrders._sum.deliveryFee || 0,
        totalDeliveries: totalOrders._count.id,
        recentOrders: todayOrders,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── GET /api/rider/profile ───────────────────────────────
router.get('/profile', roleGuard('RIDER'), async (req: AuthRequest, res: Response) => {
  try {
    const rider = await prisma.rider.findUnique({
      where: { userId: req.user!.id },
      include: { user: { select: { fullName: true, email: true, phone: true, profilePhoto: true } } },
    });
    return res.json({ success: true, data: rider });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

export { router as riderRouter };
