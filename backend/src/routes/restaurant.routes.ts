import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, roleGuard, AuthRequest } from '../middleware/auth.middleware';

const router = Router();
const prisma = new PrismaClient();

// ─── GET /api/restaurants ─────────────────────────────────
router.get('/', async (req: Request, res: Response) => {
  try {
    const { city, category, search, page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = { isActive: true };
    if (city) where.city = { contains: city as string, mode: 'insensitive' };
    if (category) where.categories = { has: category as string };
    if (search) where.name = { contains: search as string, mode: 'insensitive' };

    const [restaurants, total] = await Promise.all([
      prisma.restaurant.findMany({
        where,
        skip,
        take: Number(limit),
        select: {
          id: true, name: true, slug: true, logoUrl: true, bannerUrl: true,
          city: true, categories: true, ratingAvg: true, ratingCount: true,
          minOrderValue: true, deliveryFee: true, deliveryTimeMins: true,
          isOpen: true, isFeatured: true,
        },
        orderBy: [{ isFeatured: 'desc' }, { ratingAvg: 'desc' }],
      }),
      prisma.restaurant.count({ where }),
    ]);

    return res.json({ success: true, data: restaurants, meta: { total, page: Number(page), limit: Number(limit) } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── GET /api/restaurants/:slug ───────────────────────────
router.get('/:slug', async (req: Request, res: Response) => {
  try {
    const restaurant = await prisma.restaurant.findUnique({
      where: { slug: req.params.slug as string },
      include: {
        operatingHours: true,
        menuCategories: {
          where: { isActive: true },
          include: {
            items: {
              where: { isAvailable: true },
              include: { sizes: true, toppingGroups: { include: { toppings: true } } },
              orderBy: { displayOrder: 'asc' },
            },
          },
          orderBy: { displayOrder: 'asc' },
        },
      },
    });

    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found' });
    }

    return res.json({ success: true, data: restaurant });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── GET /api/restaurants/:id/menu ────────────────────────
router.get('/:id/menu', async (req: Request, res: Response) => {
  try {
    const categories = await prisma.menuCategory.findMany({
      where: { restaurantId: req.params.id as string, isActive: true },
      include: {
        items: {
          where: { isAvailable: true },
          include: { sizes: true, toppingGroups: { include: { toppings: true } } },
          orderBy: { displayOrder: 'asc' },
        },
      },
      orderBy: { displayOrder: 'asc' },
    });
    return res.json({ success: true, data: categories });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── GET /api/restaurants/:id/reviews ──────────────────────
router.get('/:id/reviews', async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const reviews = await prisma.review.findMany({
      where: { restaurantId: req.params.id as string },
      include: { customer: { select: { fullName: true, profilePhoto: true } } },
      orderBy: { createdAt: 'desc' },
      skip,
      take: Number(limit),
    });
    const total = await prisma.review.count({ where: { restaurantId: req.params.id as string } });
    return res.json({ success: true, data: reviews, meta: { total, page: Number(page) } });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── GET /api/restaurants/:id/orders (owner only) ─────────
router.get('/:id/orders', authMiddleware, roleGuard('RESTAURANT_OWNER', 'SUPER_ADMIN'), async (req: AuthRequest, res: Response) => {
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
      },
      orderBy: { createdAt: 'desc' },
    });
    const total = await prisma.order.count({ where });
    return res.json({ success: true, data: orders, meta: { total } });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── PUT /api/restaurants/:id (owner updates info) ────────
router.put('/:id', authMiddleware, roleGuard('RESTAURANT_OWNER', 'SUPER_ADMIN'), async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, logoUrl, bannerUrl, phone, email, website, addressLine1, city, postcode,
            categories, minOrderValue, deliveryFee, deliveryTimeMins } = req.body;
    const updated = await prisma.restaurant.update({
      where: { id: req.params.id as string },
      data: { name, description, logoUrl, bannerUrl, phone, email, website, addressLine1, city, postcode,
              categories, minOrderValue, deliveryFee, deliveryTimeMins, updatedAt: new Date() },
    });
    return res.json({ success: true, data: updated });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── PUT /api/restaurants/:id/status (toggle open/closed) ──
router.put('/:id/status', authMiddleware, roleGuard('RESTAURANT_OWNER', 'SUPER_ADMIN'), async (req: AuthRequest, res: Response) => {
  try {
    const { isOpen } = req.body;
    const updated = await prisma.restaurant.update({
      where: { id: req.params.id as string },
      data: { isOpen },
    });
    return res.json({ success: true, data: updated });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── PUT /api/restaurants/:id/hours ───────────────────────
router.put('/:id/hours', authMiddleware, roleGuard('RESTAURANT_OWNER', 'SUPER_ADMIN'), async (req: AuthRequest, res: Response) => {
  try {
    const { hours } = req.body; // array of { dayOfWeek, openTime, closeTime, isClosed }
    // Delete existing and recreate
    await prisma.operatingHours.deleteMany({ where: { restaurantId: req.params.id as string } });
    await prisma.operatingHours.createMany({
      data: hours.map((h: any) => ({ ...h, restaurantId: req.params.id as string })),
    });
    return res.json({ success: true, message: 'Hours updated' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ════════════════════════════════════════════════════════════
// MENU CATEGORY CRUD (Restaurant Owner)
// ════════════════════════════════════════════════════════════

// ─── POST /api/restaurants/:id/categories ─────────────────
router.post('/:id/categories', authMiddleware, roleGuard('RESTAURANT_OWNER', 'SUPER_ADMIN'), async (req: AuthRequest, res: Response) => {
  try {
    const { name, displayOrder } = req.body;
    const category = await prisma.menuCategory.create({
      data: { restaurantId: req.params.id as string, name, displayOrder: displayOrder || 0 },
    });
    return res.status(201).json({ success: true, data: category });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── PUT /api/restaurants/:id/categories/:catId ───────────
router.put('/:id/categories/:catId', authMiddleware, roleGuard('RESTAURANT_OWNER', 'SUPER_ADMIN'), async (req: AuthRequest, res: Response) => {
  try {
    const { name, displayOrder, isActive } = req.body;
    const category = await prisma.menuCategory.update({
      where: { id: req.params.catId as string },
      data: { name, displayOrder, isActive },
    });
    return res.json({ success: true, data: category });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── DELETE /api/restaurants/:id/categories/:catId ────────
router.delete('/:id/categories/:catId', authMiddleware, roleGuard('RESTAURANT_OWNER', 'SUPER_ADMIN'), async (req: AuthRequest, res: Response) => {
  try {
    await prisma.menuCategory.delete({ where: { id: req.params.catId as string } });
    return res.json({ success: true, message: 'Category deleted' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ════════════════════════════════════════════════════════════
// MENU ITEM CRUD (Restaurant Owner)
// ════════════════════════════════════════════════════════════

// ─── POST /api/restaurants/:id/items ──────────────────────
router.post('/:id/items', authMiddleware, roleGuard('RESTAURANT_OWNER', 'SUPER_ADMIN'), async (req: AuthRequest, res: Response) => {
  try {
    const { categoryId, name, description, imageUrl, basePrice, calories, allergens, displayOrder, sizes } = req.body;
    const item = await prisma.menuItem.create({
      data: {
        restaurantId: req.params.id as string,
        categoryId,
        name, description, imageUrl, basePrice: basePrice || 0, calories, allergens: allergens || [],
        displayOrder: displayOrder || 0,
        sizes: sizes ? { create: sizes } : undefined,
      },
      include: { sizes: true },
    });
    return res.status(201).json({ success: true, data: item });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── PUT /api/restaurants/:id/items/:itemId ───────────────
router.put('/:id/items/:itemId', authMiddleware, roleGuard('RESTAURANT_OWNER', 'SUPER_ADMIN'), async (req: AuthRequest, res: Response) => {
  try {
    const { categoryId, name, description, imageUrl, basePrice, calories, allergens, isAvailable, displayOrder } = req.body;
    const item = await prisma.menuItem.update({
      where: { id: req.params.itemId as string },
      data: { categoryId, name, description, imageUrl, basePrice, calories, allergens, isAvailable, displayOrder },
    });
    return res.json({ success: true, data: item });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── DELETE /api/restaurants/:id/items/:itemId ────────────
router.delete('/:id/items/:itemId', authMiddleware, roleGuard('RESTAURANT_OWNER', 'SUPER_ADMIN'), async (req: AuthRequest, res: Response) => {
  try {
    await prisma.menuItem.delete({ where: { id: req.params.itemId as string } });
    return res.json({ success: true, message: 'Item deleted' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── POST /api/restaurants/:id/reviews (Customer reviews) ─
router.post('/:id/reviews', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { orderId, rating, comment } = req.body;
    const review = await prisma.review.create({
      data: {
        restaurantId: req.params.id as string,
        customerId: req.user!.id,
        orderId,
        rating,
        comment,
      },
    });
    // Update restaurant rating average
    const agg = await prisma.review.aggregate({
      where: { restaurantId: req.params.id as string },
      _avg: { rating: true },
      _count: { rating: true },
    });
    await prisma.restaurant.update({
      where: { id: req.params.id as string },
      data: { ratingAvg: agg._avg.rating || 0, ratingCount: agg._count.rating },
    });
    return res.status(201).json({ success: true, data: review });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

export { router as restaurantRouter };
