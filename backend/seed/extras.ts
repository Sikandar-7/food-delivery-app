import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Idempotent top-up seed for data the original seed never created:
 * operating hours and reviews. Safe to re-run — every section checks first
 * and skips if the data is already there. Deliberately does NOT touch menu
 * data, which seed.ts creates with `create` (re-running that would duplicate).
 */

const REVIEW_TEXTS: Record<string, { rating: number; comment: string }[]> = {
  'mcdonalds-lahore': [
    { rating: 5, comment: 'Order 20 minute mein pohanch gaya, burger bilkul garam tha. Zabardast!' },
    { rating: 4, comment: 'Food is always consistent. Fries could have been a bit fresher though.' },
    { rating: 5, comment: 'Big Mac exactly like the outlet. Delivery rider was very polite.' },
    { rating: 4, comment: 'Good packaging, nothing spilled. Will order again.' },
  ],
  'kfc-lahore': [
    { rating: 5, comment: 'Zinger was crispy and hot. Best fried chicken delivery in Lahore.' },
    { rating: 4, comment: 'Taste is great but delivery took a little longer than the estimate.' },
    { rating: 5, comment: 'Family bucket was perfectly packed. Highly recommended.' },
  ],
};

async function main() {
  console.log('🌱 Seeding extras (operating hours + reviews)...\n');

  const restaurants = await prisma.restaurant.findMany({ select: { id: true, slug: true, name: true } });
  if (restaurants.length === 0) {
    console.log('⚠️  No restaurants found — run `npm run seed` first.');
    return;
  }

  // ─── Operating Hours (0 = Monday … 6 = Sunday) ───────────
  let hoursCreated = 0;
  for (const r of restaurants) {
    const existing = await prisma.operatingHours.count({ where: { restaurantId: r.id } });
    if (existing > 0) {
      console.log(`⏭️  ${r.name}: operating hours already present (${existing})`);
      continue;
    }
    for (let day = 0; day <= 6; day++) {
      const isWeekend = day >= 5; // Sat + Sun open later
      await prisma.operatingHours.create({
        data: {
          restaurantId: r.id,
          dayOfWeek: day,
          openTime: '11:00',
          closeTime: isWeekend ? '03:00' : '01:00',
          isClosed: false,
        },
      });
      hoursCreated++;
    }
    console.log(`✅ ${r.name}: 7 days of opening hours added`);
  }

  // ─── Reviews ─────────────────────────────────────────────
  const customer = await prisma.user.findUnique({ where: { email: 'customer@test.com' } });
  if (!customer) {
    console.log('⚠️  Demo customer not found — skipping reviews.');
  } else {
    let reviewsCreated = 0;
    for (const r of restaurants) {
      const existing = await prisma.review.count({ where: { restaurantId: r.id } });
      if (existing > 0) {
        console.log(`⏭️  ${r.name}: reviews already present (${existing})`);
        continue;
      }
      const texts = REVIEW_TEXTS[r.slug] ?? REVIEW_TEXTS['mcdonalds-lahore'];
      for (const [i, t] of texts.entries()) {
        await prisma.review.create({
          data: {
            orderId: `seed-${r.slug}-${i + 1}`,
            customerId: customer.id,
            restaurantId: r.id,
            rating: t.rating,
            comment: t.comment,
            // stagger so the list has a believable order
            createdAt: new Date(Date.now() - (i + 1) * 36 * 60 * 60 * 1000),
          },
        });
        reviewsCreated++;
      }
      console.log(`✅ ${r.name}: ${texts.length} reviews added`);
    }
    if (reviewsCreated > 0) console.log(`   (${reviewsCreated} reviews total)`);
  }

  // ─── Keep the restaurant rating summary in sync with reviews ──
  for (const r of restaurants) {
    const agg = await prisma.review.aggregate({
      where: { restaurantId: r.id },
      _avg: { rating: true },
      _count: { rating: true },
    });
    if (agg._count.rating > 0) {
      await prisma.restaurant.update({
        where: { id: r.id },
        data: {
          ratingAvg: Number((agg._avg.rating ?? 0).toFixed(1)),
          ratingCount: agg._count.rating,
        },
      });
    }
  }
  console.log('✅ Restaurant rating summaries recalculated');

  console.log(`\n🎉 Extras seed complete (${hoursCreated} opening-hour rows created).`);
}

main()
  .catch((e) => {
    console.error('❌ Extras seed error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
