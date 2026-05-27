import { Router, Response } from 'express';
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
    let discount = 0;
    const orderItems: any[] = [];

    for (const item of items) {
      const menuItem = await prisma.menuItemSize.findFirst({
        where: { menuItemId: item.menuItemId, sizeName: item.sizeName },
      });
      if (!menuItem) {
        // fallback: use basePrice from parent menuItem
        const parent = await prisma.menuItem.findUnique({ where: { id: item.menuItemId } });
        if (!parent) continue;
        const itemTotal = parent.basePrice * item.quantity;
        subtotal += itemTotal;
        orderItems.push({
          menuItemId: item.menuItemId,
          quantity: item.quantity,
          sizeName: item.sizeName || 'Regular',
          unitPrice: parent.basePrice,
          customizations: item.customizations || [],
          itemTotal,
        });
        continue;
      }

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

    // Validate minimum order
    if (subtotal < restaurant.minOrderValue) {
      return res.status(400).json({
        success: false,
        message: `Minimum order is Rs.${restaurant.minOrderValue}. Your cart is Rs.${subtotal}.`,
      });
    }

    // Apply coupon
    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({ where: { code: couponCode } });
      if (coupon && coupon.isActive && new Date() >= coupon.validFrom && new Date() <= coupon.validTo) {
        if (subtotal >= coupon.minOrderValue) {
          if (coupon.type === 'PERCENTAGE') {
            discount = Math.min(subtotal * coupon.discountValue / 100, coupon.maxDiscount || Infinity);
          } else if (coupon.type === 'FIXED_AMOUNT') {
            discount = coupon.discountValue;
          } else if (coupon.type === 'FREE_DELIVERY') {
            discount = restaurant.deliveryFee;
          }
        }
      }
    }

    const deliveryFee = orderType === 'DELIVERY' ? restaurant.deliveryFee : 0;
    const total = subtotal - discount + deliveryFee;

    // Generate unique order number
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
        discountAmount: discount,
        deliveryFee,
        total,
        paymentMethod: paymentMethod || 'CASH',
        paymentStatus: 'PENDING',
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

// ─── GET /api/orders/my (Customer's order history) ────────
router.get('/my', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const orders = await prisma.order.findMany({
      where: { customerId: req.user!.id },
      include: {
        restaurant: { select: { name: true, logoUrl: true, slug: true } },
        items: { include: { menuItem: { select: { name: true } } } },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: Number(limit),
    });
    const total = await prisma.order.count({ where: { customerId: req.user!.id } });
    return res.json({ success: true, data: orders, meta: { total, page: Number(page) } });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── GET /api/orders/:id ─────────────────────────────────
router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id as string },
      include: {
        restaurant: { select: { name: true, logoUrl: true, phone: true, addressLine1: true } },
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
    const { status, reason } = req.body;
    const validStatuses = ['PENDING', 'ACCEPTED', 'PREPARING', 'READY', 'ON_THE_WAY', 'DELIVERED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid order status' });
    }

    const order = await prisma.order.update({
      where: { id: req.params.id as string },
      data: {
        status: status as any,
        ...(status === 'DELIVERED' ? { deliveredAt: new Date(), paymentStatus: 'PAID' as any } : {}),
        ...(status === 'CANCELLED' ? { cancelledAt: new Date(), cancellationReason: reason } : {}),
      },
    });
    return res.json({ success: true, data: order });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── POST /api/orders/:id/assign-rider (Admin) ────────────
router.post('/:id/assign-rider', authMiddleware, roleGuard('SUPER_ADMIN'), async (req: AuthRequest, res: Response) => {
  try {
    const { riderId } = req.body;
    const order = await prisma.order.update({
      where: { id: req.params.id as string },
      data: {
        riderId,
        status: 'ON_THE_WAY' as any,
      },
      include: {
        rider: { include: { user: { select: { fullName: true } } } },
      },
    });
    return res.json({ success: true, message: 'Rider assigned', data: order });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── POST /api/orders/:id/cancel (Customer cancels) ───────
router.post('/:id/cancel', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const order = await prisma.order.findUnique({ where: { id: req.params.id as string } });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    // Only allow cancel if PENDING or ACCEPTED
    if (!['PENDING', 'ACCEPTED'].includes(order.status)) {
      return res.status(400).json({ success: false, message: 'Order cannot be cancelled at this stage' });
    }

    const cancelled = await prisma.order.update({
      where: { id: req.params.id as string },
      data: {
        status: 'CANCELLED',
        cancelledAt: new Date(),
        cancellationReason: req.body.reason || 'Customer cancelled',
      },
    });
    return res.json({ success: true, data: cancelled });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── GET /api/orders/restaurant/:id (Restaurant sees their orders) ─
router.get('/restaurant/:id', authMiddleware, roleGuard('RESTAURANT_OWNER', 'SUPER_ADMIN'), async (req: AuthRequest, res: Response) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const where: any = { restaurantId: req.params.id as string };
    if (status) where.status = status;

    const orders = await prisma.order.findMany({
      where,
      skip,
      take: Number(limit),
      include: {
        customer: { select: { fullName: true, phone: true } },
        items: { include: { menuItem: { select: { name: true } } } },
        rider: { include: { user: { select: { fullName: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    });
    const total = await prisma.order.count({ where });
    return res.json({ success: true, data: orders, meta: { total, page: Number(page) } });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

export { router as orderRouter };
