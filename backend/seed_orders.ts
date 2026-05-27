import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedOrders() {
  console.log('Seeding fake orders for dashboard...');
  
  // get a customer, a rider, a restaurant, a menu item
  const customer = await prisma.user.findFirst({ where: { role: 'CUSTOMER' } });
  const rider = await prisma.rider.findFirst();
  const restaurant = await prisma.restaurant.findFirst();
  
  if (!customer || !rider || !restaurant) {
    console.log('Missing basic data (customer, rider, or restaurant). Please run npm run seed first.');
    return;
  }

  const menuItem = await prisma.menuItem.findFirst({ where: { restaurantId: restaurant.id } });
  
  if (!menuItem) {
    console.log('Missing menu items.');
    return;
  }

  const today = new Date();
  
  for (let i = 0; i < 50; i++) {
    const date = new Date();
    // Spread evenly across the last 7 days
    date.setDate(today.getDate() - (i % 7));
    
    // Some random times
    date.setHours(Math.floor(Math.random() * 12) + 9); 
    
    // Status can be DELIVERED for past days, and maybe some PREPARING for today
    const isToday = (i % 7) === 0;
    const status = isToday ? (i % 2 === 0 ? 'PREPARING' : 'PENDING') : 'DELIVERED';

    await prisma.order.create({
      data: {
        orderNumber: `ORD-TEST-${Math.floor(Math.random() * 100000)}`,
        customerId: customer.id,
        restaurantId: restaurant.id,
        riderId: status === 'DELIVERED' ? rider.id : null,
        status: status as any,
        total: Math.floor(Math.random() * 2000) + 500,
        subtotal: Math.floor(Math.random() * 1800) + 400,
        deliveryFee: 150,
        paymentMethod: 'CASH',
        paymentStatus: status === 'DELIVERED' ? 'PAID' : 'PENDING',
        createdAt: date,
        deliveredAt: status === 'DELIVERED' ? date : null,
        items: {
          create: [
            {
              menuItemId: menuItem.id,
              sizeName: 'Regular',
              quantity: Math.floor(Math.random() * 3) + 1,
              unitPrice: menuItem.basePrice,
              itemTotal: menuItem.basePrice * (Math.floor(Math.random() * 3) + 1)
            }
          ]
        }
      }
    });
  }

  // Set rider online for active riders stat
  await prisma.rider.update({
    where: { id: rider.id },
    data: { isOnline: true }
  });

  console.log('Successfully seeded 50 orders!');
}

seedOrders()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
