import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Order.pk database...\n');

  // ─── 1. Create Users ──────────────────────────────────
  const adminPassword = await bcrypt.hash('Admin@123', 12);
  const ownerPassword = await bcrypt.hash('Owner@123', 12);
  const riderPassword = await bcrypt.hash('Rider@123', 12);
  const customerPassword = await bcrypt.hash('Test@123', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@order.pk' },
    update: {},
    create: { email: 'admin@order.pk', passwordHash: adminPassword, fullName: 'Super Admin', role: 'SUPER_ADMIN', emailVerified: true },
  });

  const owner1 = await prisma.user.upsert({
    where: { email: 'owner@mcdonalds.pk' },
    update: {},
    create: { email: 'owner@mcdonalds.pk', passwordHash: ownerPassword, fullName: 'McD Owner Pakistan', role: 'RESTAURANT_OWNER', emailVerified: true },
  });

  const owner2 = await prisma.user.upsert({
    where: { email: 'owner@kfc.pk' },
    update: {},
    create: { email: 'owner@kfc.pk', passwordHash: ownerPassword, fullName: 'KFC Owner Pakistan', role: 'RESTAURANT_OWNER', emailVerified: true },
  });

  const rider1User = await prisma.user.upsert({
    where: { email: 'rider@order.pk' },
    update: {},
    create: { email: 'rider@order.pk', passwordHash: riderPassword, fullName: 'Ahmed Khan', role: 'RIDER', phone: '0300-1111111', emailVerified: true },
  });

  const customer = await prisma.user.upsert({
    where: { email: 'customer@test.com' },
    update: {},
    create: { email: 'customer@test.com', passwordHash: customerPassword, fullName: 'Test Customer', role: 'CUSTOMER', phone: '0300-9999999', emailVerified: true },
  });

  await prisma.rider.upsert({
    where: { userId: rider1User.id },
    update: {},
    create: { userId: rider1User.id, vehicleType: 'Motorbike', vehicleReg: 'LHR-1234' },
  });

  console.log('✅ Users created');

  // ─── 2. Create Restaurants ────────────────────────────
  const mcdonalds = await prisma.restaurant.upsert({
    where: { slug: 'mcdonalds-lahore' },
    update: {},
    create: {
      ownerId: owner1.id,
      name: "McDonald's Pakistan",
      slug: 'mcdonalds-lahore',
      description: "Pakistan's #1 fast food chain serving Big Macs, McChicken and more!",
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/McDonald%27s_Golden_Arches.svg/1200px-McDonald%27s_Golden_Arches.svg.png',
      bannerUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/McDonald%27s_Golden_Arches.svg/1200px-McDonald%27s_Golden_Arches.svg.png',
      phone: '+92-42-111-627-627',
      email: 'info@mcdonalds.pk',
      website: 'https://mcdonalds.com.pk',
      addressLine1: 'MM Alam Road, Gulberg III',
      city: 'Lahore',
      postcode: '54000',
      categories: ['Burgers', 'Fast Food', 'Chicken'],
      minOrderValue: 400,
      deliveryFee: 150,
      deliveryTimeMins: 30,
      isActive: true,
      isFeatured: true,
      isOpen: true,
      ratingAvg: 4.5,
      ratingCount: 2847,
    },
  });

  const kfc = await prisma.restaurant.upsert({
    where: { slug: 'kfc-lahore' },
    update: {},
    create: {
      ownerId: owner2.id,
      name: 'KFC Pakistan',
      slug: 'kfc-lahore',
      description: "It's finger lickin' good! Original Recipe chicken and more.",
      phone: '+92-42-111-532-532',
      email: 'info@kfc.pk',
      addressLine1: 'Liberty Market, Gulberg',
      city: 'Lahore',
      postcode: '54000',
      categories: ['Chicken', 'Fast Food', 'Burgers'],
      minOrderValue: 500,
      deliveryFee: 150,
      deliveryTimeMins: 25,
      isActive: true,
      isFeatured: true,
      isOpen: true,
      ratingAvg: 4.3,
      ratingCount: 1923,
    },
  });

  console.log('✅ Restaurants created');

  // ─── 3. Create Menu Categories & Items ────────────────
  // McDonald's Menu
  const mcdBurgers = await prisma.menuCategory.create({
    data: { restaurantId: mcdonalds.id, name: 'Burgers', displayOrder: 1 },
  });
  const mcdChicken = await prisma.menuCategory.create({
    data: { restaurantId: mcdonalds.id, name: 'Chicken', displayOrder: 2 },
  });
  const mcdDrinks = await prisma.menuCategory.create({
    data: { restaurantId: mcdonalds.id, name: 'Cold Drinks', displayOrder: 3 },
  });

  // McDonald's Items
  await prisma.menuItem.create({
    data: {
      restaurantId: mcdonalds.id,
      categoryId: mcdBurgers.id,
      name: 'Big Mac',
      description: 'Two 100% beef patties with special sauce, lettuce, cheese, pickles, onions on a sesame seed bun.',
      imageUrl: 'https://www.mcdonalds.com.pk/wp-content/uploads/2022/03/Big-Mac.png',
      basePrice: 650,
      calories: 563,
      isAvailable: true,
      sizes: { create: [
        { sizeName: 'Regular', price: 650 },
        { sizeName: 'Large Meal', price: 950 },
      ]},
    },
  });

  await prisma.menuItem.create({
    data: {
      restaurantId: mcdonalds.id,
      categoryId: mcdBurgers.id,
      name: 'McChicken Deluxe',
      description: 'Crispy chicken fillet with lettuce, mayo on a toasted bun.',
      imageUrl: 'https://www.mcdonalds.com.pk/wp-content/uploads/2022/03/McChicken-Deluxe.png',
      basePrice: 550,
      calories: 490,
      sizes: { create: [
        { sizeName: 'Regular', price: 550 },
        { sizeName: 'Large Meal', price: 850 },
      ]},
    },
  });

  await prisma.menuItem.create({
    data: {
      restaurantId: mcdonalds.id,
      categoryId: mcdBurgers.id,
      name: 'Quarter Pounder',
      description: 'Quarter pound of 100% beef patty with cheese, pickles, onions, ketchup and mustard.',
      imageUrl: 'https://www.mcdonalds.com.pk/wp-content/uploads/2022/03/Quarter-Pounder.png',
      basePrice: 720,
      sizes: { create: [
        { sizeName: 'Regular', price: 720 },
        { sizeName: 'Large Meal', price: 1020 },
      ]},
    },
  });

  await prisma.menuItem.create({
    data: {
      restaurantId: mcdonalds.id,
      categoryId: mcdChicken.id,
      name: 'McNuggets',
      description: 'Crispy golden chicken nuggets. Choose your dipping sauce.',
      imageUrl: 'https://www.mcdonalds.com.pk/wp-content/uploads/2022/03/Chicken-McNuggets.png',
      basePrice: 350,
      sizes: { create: [
        { sizeName: '6 Piece', price: 350 },
        { sizeName: '9 Piece', price: 500 },
        { sizeName: '20 Piece', price: 950 },
      ]},
    },
  });

  await prisma.menuItem.create({
    data: {
      restaurantId: mcdonalds.id,
      categoryId: mcdChicken.id,
      name: 'McSpicy Chicken Burger',
      description: 'Our spiciest chicken sandwich, with a crispy, juicy fillet and fiery seasoning.',
      imageUrl: 'https://www.mcdonalds.com.pk/wp-content/uploads/2023/01/McSpicy.png',
      basePrice: 620,
      sizes: { create: [
        { sizeName: 'Burger Only', price: 620 },
        { sizeName: 'Meal', price: 920 },
      ]},
    },
  });

  await prisma.menuItem.create({
    data: {
      restaurantId: mcdonalds.id,
      categoryId: mcdDrinks.id,
      name: 'Coca-Cola',
      description: 'Ice cold Coca-Cola.',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Coca-Cola_logo.svg/1200px-Coca-Cola_logo.svg.png',
      basePrice: 100,
      sizes: { create: [
        { sizeName: 'Small', price: 100 },
        { sizeName: 'Medium', price: 130 },
        { sizeName: 'Large', price: 160 },
      ]},
    },
  });

  await prisma.menuItem.create({
    data: {
      restaurantId: mcdonalds.id,
      categoryId: mcdDrinks.id,
      name: 'McFlurry - Oreo',
      description: 'Creamy soft serve blended with Oreo cookie crumbles.',
      basePrice: 290,
      sizes: { create: [
        { sizeName: 'Regular', price: 290 },
      ]},
    },
  });

  // KFC Menu
  const kfcChicken = await prisma.menuCategory.create({
    data: { restaurantId: kfc.id, name: 'Chicken Pieces', displayOrder: 1 },
  });
  const kfcBurgers = await prisma.menuCategory.create({
    data: { restaurantId: kfc.id, name: 'Burgers', displayOrder: 2 },
  });
  const kfcSides = await prisma.menuCategory.create({
    data: { restaurantId: kfc.id, name: 'Sides & Drinks', displayOrder: 3 },
  });

  await prisma.menuItem.create({
    data: {
      restaurantId: kfc.id,
      categoryId: kfcChicken.id,
      name: 'Original Recipe Chicken',
      description: "Colonel's secret recipe of 11 herbs and spices.",
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/KFC_logo.svg/1200px-KFC_logo.svg.png',
      basePrice: 480,
      sizes: { create: [
        { sizeName: '2 Piece', price: 480 },
        { sizeName: '4 Piece', price: 850 },
        { sizeName: '8 Piece', price: 1550 },
      ]},
    },
  });

  await prisma.menuItem.create({
    data: {
      restaurantId: kfc.id,
      categoryId: kfcChicken.id,
      name: 'Hot & Crispy Chicken',
      description: 'Extra crispy, extra spicy! Our hot & crispy chicken strips ready in minutes.',
      basePrice: 520,
      sizes: { create: [
        { sizeName: '2 Piece', price: 520 },
        { sizeName: '4 Piece', price: 920 },
      ]},
    },
  });

  await prisma.menuItem.create({
    data: {
      restaurantId: kfc.id,
      categoryId: kfcBurgers.id,
      name: 'Zinger Burger',
      description: "KFC's iconic spicy chicken burger with crispy fillet and creamy mayo.",
      basePrice: 450,
      sizes: { create: [
        { sizeName: 'Burger Only', price: 450 },
        { sizeName: 'Meal (with fries & drink)', price: 750 },
      ]},
    },
  });

  await prisma.menuItem.create({
    data: {
      restaurantId: kfc.id,
      categoryId: kfcBurgers.id,
      name: 'Tower Burger',
      description: 'A towering stack of crispy chicken, cheese, bacon, fresh lettuce and mayo.',
      basePrice: 690,
      sizes: { create: [
        { sizeName: 'Burger Only', price: 690 },
        { sizeName: 'Meal', price: 990 },
      ]},
    },
  });

  await prisma.menuItem.create({
    data: {
      restaurantId: kfc.id,
      categoryId: kfcSides.id,
      name: 'Krinkle Cut Fries',
      description: 'Wavy, crispy golden fries seasoned with our signature salt.',
      basePrice: 180,
      sizes: { create: [
        { sizeName: 'Regular', price: 180 },
        { sizeName: 'Large', price: 250 },
      ]},
    },
  });

  await prisma.menuItem.create({
    data: {
      restaurantId: kfc.id,
      categoryId: kfcSides.id,
      name: 'Pepsi',
      description: 'Ice cold Pepsi to wash it all down.',
      basePrice: 90,
      sizes: { create: [
        { sizeName: 'Medium', price: 90 },
        { sizeName: 'Large', price: 120 },
      ]},
    },
  });

  console.log('✅ Menu items created');

  // ─── 4. Create Coupons ────────────────────────────────
  await prisma.coupon.upsert({
    where: { code: 'FIRST10' },
    update: {},
    create: {
      code: 'FIRST10',
      type: 'PERCENTAGE',
      discountValue: 10,
      minOrderValue: 500,
      maxDiscount: 200,
      validFrom: new Date(),
      validTo: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      firstOrderOnly: true,
      isActive: true,
    },
  });

  await prisma.coupon.upsert({
    where: { code: 'SAVE100' },
    update: {},
    create: {
      code: 'SAVE100',
      type: 'FIXED_AMOUNT',
      discountValue: 100,
      minOrderValue: 1000,
      validFrom: new Date(),
      validTo: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      isActive: true,
    },
  });

  await prisma.coupon.upsert({
    where: { code: 'FREEDEL' },
    update: {},
    create: {
      code: 'FREEDEL',
      type: 'FREE_DELIVERY',
      discountValue: 0,
      minOrderValue: 800,
      validFrom: new Date(),
      validTo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      isActive: true,
    },
  });

  console.log('✅ Coupons created');

  console.log('\n🎉 Seed complete! Login credentials:');
  console.log('  Super Admin:    admin@order.pk       / Admin@123');
  console.log('  Restaurant Own: owner@mcdonalds.pk   / Owner@123');
  console.log('  Rider:          rider@order.pk        / Rider@123');
  console.log('  Customer:       customer@test.com     / Test@123\n');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
