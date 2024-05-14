import { PrismaClient } from '@prisma/client';
import { ordersData } from './data/orders';

const prisma = new PrismaClient();

export const seedOrders = async () => {
  // Seed orders
  for (const orderData of ordersData) {
    await prisma.order.create({
      data: orderData,
    });
  }

  console.log('Orders seeded successfully.');
};