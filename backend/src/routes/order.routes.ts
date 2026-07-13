import { Router, Response } from 'express';
import { prisma } from '../lib/prisma';
import { authMiddleware, roleGuard, AuthRequest } from '../middleware/auth.middleware';

const router = Router();

// ─── POST /api/orders (Customer places order) ─────────────
router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { restaurantId, items, deliveryAddress, paymentMethod, couponCode, orderType, specialInstructions } = req.body;

    if (!restaurantId || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'restaurantId and at least one item are required' });
    }

    const restaurant = await prisma.restaurant.findUnique({ where: { id: restaurantId } });
    if (!restaurant) return res.status(404).json({ success: false, message: 'Restaurant not found' });
    if (!restaurant.isActive || !restaurant.isOpen) {
      return res.status(400).json({ success: false, message: 'This restaurant is currently not accepting orders' });
    }

    // ── Build order items with SERVER-SIDE pricing (never trust client prices) ──
    let subtotal = 0;
    const orderItems: any[] = [];

    for (const item of items) {
      const menuItem = await prisma.menuItem.findUnique({
        where: { id: item.menuItemId },
        include: { sizes: true, toppingGroups: { include: { toppings: true } } },
      });
      if (!menuItem) {
        return res.status(400).json({ success: false, message: `Menu item not found: ${item.menuItemId}` });
      }
      if (menuItem.restaurantId !== restaurantId) {
        return res.status(400).json({ success: false, message: 'All items must belong to the selected restaurant' });
      }
      if (!menuItem.isAvailable) {
        return res.status(400).json({ success: false, message: `${menuItem.name} is currently unavailable` });
      }

      // unit price from chosen size, else basePrice — sourced from DB
      const size = item.sizeName ? menuItem.sizes.find((s) => s.sizeName === item.sizeName) : undefined;
      const unitPrice = size ? size.price : menuItem.basePrice;

      // toppings priced from DB by id (client only sends ids, never prices)
      const requestedToppingIds: string[] = Array.isArray(item.toppingIds) ? item.toppingIds : [];
      const selectedToppings = menuItem.toppingGroups
        .flatMap((g) => g.toppings)
        .filter((t) => requestedToppingIds.includes(t.id));
      const toppingsSurcharge = selectedToppings.reduce((sum, t) => sum + (t.isFree ? 0 : t.extraPrice), 0);

      const quantity = Math.max(1, Number(item.quantity) || 1);
      const itemTotal = (unitPrice + toppingsSurcharge) * quantity;
      subtotal += itemTotal;

      orderItems.push({
        menuItemId: menuItem.id,
        quantity,
        sizeName: item.sizeName || 'Regular',
        unitPrice,
        customizations: selectedToppings.map((t) => ({ id: t.id, name: t.name, extraPrice: t.isFree ? 0 : t.extraPrice })),
        itemTotal,
      });
    }

    // Validate minimum order
    if (subtotal < restaurant.minOrderValue) {
      return res.status(400).json({
        success: false,
        message: `Minimum order is Rs.${restaurant.minOrderValue}. Your cart is Rs.${subtotal}.`,
      });
    }

    // ── Coupon validation + FULL enforcement (server-side) ──
    let discount = 0;
    let appliedCouponId: string | null = null;
    let normalizedCouponCode: string | null = null;
    if (couponCode) {
      const code = String(couponCode).toUpperCase();
      const coupon = await prisma.coupon.findUnique({ where: { code } });
      const now = new Date();
      if (!coupon || !coupon.isActive || now < coupon.validFrom || now > coupon.validTo) {
        return res.status(400).json({ success: false, message: 'Invalid or expired coupon' });
      }
      if (coupon.restaurantId && coupon.restaurantId !== restaurantId) {
        return res.status(400).json({ success: false, message: 'Coupon is not valid for this restaurant' });
      }
      if (subtotal < coupon.minOrderValue) {
        return res.status(400).json({ success: false, message: `Coupon requires a minimum order of Rs.${coupon.minOrderValue}` });
      }
      if (coupon.totalUsageLimit != null && coupon.timesUsed >= coupon.totalUsageLimit) {
        return res.status(400).json({ success: false, message: 'This coupon has reached its usage limit' });
      }
      const userUses = await prisma.order.count({ where: { customerId: req.user!.id, couponCode: code } });
      if (userUses >= coupon.usageLimitPerUser) {
        return res.status(400).json({ success: false, message: 'You have already used this coupon' });
      }
      if (coupon.firstOrderOnly) {
        const priorOrders = await prisma.order.count({ where: { customerId: req.user!.id } });
        if (priorOrders > 0) {
          return res.status(400).json({ success: false, message: 'This coupon is valid on your first order only' });
        }
      }
      if (coupon.type === 'PERCENTAGE') {
        discount = Math.min((subtotal * coupon.discountValue) / 100, coupon.maxDiscount ?? Infinity);
      } else if (coupon.type === 'FIXED_AMOUNT') {
        discount = Math.min(coupon.discountValue, subtotal);
      } else if (coupon.type === 'FREE_DELIVERY') {
        discount = restaurant.deliveryFee;
      }
      appliedCouponId = coupon.id;
      normalizedCouponCode = code;
    }

    const deliveryFee = orderType === 'COLLECTION' ? 0 : restaurant.deliveryFee;
    const total = Math.max(0, subtotal - discount + deliveryFee);

    // Race-free order number (timestamp + random suffix instead of count()+1)
    const orderNumber = `ORD-${new Date().getFullYear()}-${Date.now().toString().slice(-7)}${Math.random().toString(36).slice(2, 5).toUpperCase()}`;

    // Atomic: create order (+ items) and bump coupon usage together
    const order = await prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
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
          couponCode: normalizedCouponCode,
          specialInstructions,
          items: { create: orderItems },
        },
        include: { items: true, restaurant: { select: { name: true, logoUrl: true } } },
      });
      if (appliedCouponId) {
        await tx.coupon.update({ where: { id: appliedCouponId }, data: { timesUsed: { increment: 1 } } });
      }
      return created;
    });

    return res.status(201).json({ success: true, message: 'Order placed successfully!', data: order });
  } catch (err) {
    console.error('Create order error:', err);
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
        restaurant: { select: { name: true, logoUrl: true, phone: true, addressLine1: true, ownerId: true } },
        customer: { select: { fullName: true, phone: true } },
        items: { include: { menuItem: { select: { name: true, imageUrl: true } } } },
        rider: { include: { user: { select: { fullName: true, phone: true } } } },
      },
    });

    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    // ── Access control: only the customer, the restaurant owner, the assigned rider, or an admin ──
    const u = req.user!;
    let allowed = u.role === 'SUPER_ADMIN' || order.customerId === u.id || order.restaurant.ownerId === u.id;
    if (!allowed && u.role === 'RIDER') {
      const rider = await prisma.rider.findUnique({ where: { userId: u.id }, select: { id: true } });
      allowed = !!rider && order.riderId === rider.id;
    }
    if (!allowed) {
      return res.status(403).json({ success: false, message: 'You do not have access to this order' });
    }

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

    // ── A restaurant owner may only touch orders for their OWN restaurant ──
    const existing = await prisma.order.findUnique({
      where: { id: req.params.id as string },
      select: { restaurant: { select: { ownerId: true } } },
    });
    if (!existing) return res.status(404).json({ success: false, message: 'Order not found' });
    if (req.user!.role === 'RESTAURANT_OWNER' && existing.restaurant.ownerId !== req.user!.id) {
      return res.status(403).json({ success: false, message: 'This order does not belong to your restaurant' });
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
    // Only the owning customer (or an admin) may cancel
    if (order.customerId !== req.user!.id && req.user!.role !== 'SUPER_ADMIN') {
      return res.status(403).json({ success: false, message: 'You cannot cancel this order' });
    }
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
