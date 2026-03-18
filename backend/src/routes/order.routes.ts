import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, roleGuard, AuthRequest } from '../middleware/auth.middleware';

const router = Router();
const prisma = new PrismaClient();

// ─── POST /api/orders (Customer places order) ─────────────
router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { restaurantId, items, deliveryAddress, paymentMethod, couponCode, orderType, specialInstructions } = req.body;

    // Calculate order total
    let subtotal = 0;
    const orderItems: any[] = [];

    for (const item of items) {
      const menuItem = await prisma.menuItemSize.findFirst({
        where: { menuItemId: item.menuItemId, sizeName: item.sizeName },
      });
      if (!menuItem) continue;
      
      const itemTotal = menuItem.price * item.quantity;
      subtotal += itemTotal;
      orderItems.push({
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        sizeName: item.sizeName,
        unitPrice: menuItem.price,
        customizations: item.customizations || [],
        itemTotal,
      });
    }

    const restaurant = await prisma.restaurant.findUnique({ where: { id: restaurantId } });
    if (!restaurant) return res.status(404).json({ success: false, message: 'Restaurant not found' });

    const deliveryFee = orderType === 'DELIVERY' ? restaurant.deliveryFee : 0;
    const total = subtotal + deliveryFee;

    // Generate order number
    const orderCount = await prisma.order.count();
    const orderNumber = `ORD-${new Date().getFullYear()}-${String(orderCount + 1).padStart(4, '0')}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerId: req.user!.id,
        restaurantId,
        status: 'PENDING',
        orderType: orderType || 'DELIVERY',
        subtotal,
        deliveryFee,
        total,
        paymentMethod: paymentMethod || 'CASH',
        paymentStatus: paymentMethod === 'CASH' ? 'PENDING' : 'PENDING',
        deliveryAddress,
        couponCode,
        specialInstructions,
        items: { create: orderItems },
      },
      include: { items: true, restaurant: { select: { name: true, logoUrl: true } } },
    });

    return res.status(201).json({ success: true, message: 'Order placed successfully!', data: order });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── GET /api/orders/my (Customer's orders) ───────────────
router.get('/my', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      where: { customerId: req.user!.id },
      include: {
        restaurant: { select: { name: true, logoUrl: true } },
        items: { include: { menuItem: { select: { name: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return res.json({ success: true, data: orders });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── GET /api/orders/:id ─────────────────────────────────
router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: {
        restaurant: { select: { name: true, logoUrl: true, phone: true } },
        customer: { select: { fullName: true, phone: true } },
        items: { include: { menuItem: { select: { name: true, imageUrl: true } } } },
        rider: { include: { user: { select: { fullName: true, phone: true } } } },
      },
    });

    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    return res.json({ success: true, data: order });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── PUT /api/orders/:id/status (Restaurant/Admin) ────────
router.put('/:id/status', authMiddleware, roleGuard('RESTAURANT_OWNER', 'SUPER_ADMIN'), async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body;
    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: {
        status,
        ...(status === 'DELIVERED' ? { deliveredAt: new Date(), paymentStatus: 'PAID' } : {}),
        ...(status === 'CANCELLED' ? { cancelledAt: new Date(), cancellationReason: req.body.reason } : {}),
      },
    });
    return res.json({ success: true, data: order });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

export { router as orderRouter };
