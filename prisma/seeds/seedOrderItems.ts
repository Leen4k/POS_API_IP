import { PrismaClient } from '@prisma/client';
import { orderItemsData } from './data/orderItems';

const prisma = new PrismaClient();

export const seedOrderItems = async () => {
  // Seed order items
  for (const orderItemData of orderItemsData) {
    await prisma.orderItem.create({
      data: orderItemData,
    });
  }

  console.log('Order items seeded successfully.');
};