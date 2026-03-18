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
      where: { slug: req.params.slug },
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

// ─── GET /api/restaurants/:id/reviews ──────────────────────
router.get('/:id/reviews', async (req: Request, res: Response) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { restaurantId: req.params.id },
      include: { customer: { select: { fullName: true, profilePhoto: true } } },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
    return res.json({ success: true, data: reviews });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── PUT /api/restaurants/:id/status (owner) ──────────────
router.put('/:id/status', authMiddleware, roleGuard('RESTAURANT_OWNER', 'SUPER_ADMIN'), async (req: AuthRequest, res: Response) => {
  try {
    const { isOpen } = req.body;
    const updated = await prisma.restaurant.update({
      where: { id: req.params.id },
      data: { isOpen },
    });
    return res.json({ success: true, data: updated });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

export { router as restaurantRouter };
