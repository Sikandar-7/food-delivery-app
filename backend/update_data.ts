import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateTimestamps() {
  console.log('Updating order timestamps for dashboard data...');
  const orders = await prisma.order.findMany();
  
  if (orders.length === 0) {
    console.log('No orders found.');
    return;
  }

  // Update half the orders to be today, half to be spread over the last 7 days
  const today = new Date();
  
  for (let i = 0; i < orders.length; i++) {
    const isToday = i % 2 === 0;
    const date = new Date();
    if (!isToday) {
      date.setDate(today.getDate() - (i % 7)); // Spread over last 7 days
    }
    
    // ensure paymentStatus is PAID for some orders to show revenue
    await prisma.order.update({
      where: { id: orders[i].id },
      data: { 
        createdAt: date,
        paymentStatus: 'PAID'
      }
    });
  }

  // Suspend one restaurant so it shows up in "Pending Approvals"
  const rest = await prisma.restaurant.findFirst();
  if (rest) {
    await prisma.restaurant.update({
      where: { id: rest.id },
      data: { isActive: false }
    });
  }

  // Set one rider to online
  const rider = await prisma.rider.findFirst();
  if (rider) {
    await prisma.rider.update({
      where: { id: rider.id },
      data: { isOnline: true }
    });
  }

  console.log('Done updating test data!');
}

updateTimestamps()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
