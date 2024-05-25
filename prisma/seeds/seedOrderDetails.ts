import { PrismaClient } from '@prisma/client';
import { orderDetailsData } from './data/orderDetails';

const prisma = new PrismaClient();

export const seedOrderDetails = async () => {
  // Seed order items
  for (const orderDetailData of orderDetailsData) {
    await prisma.orderDetail.create({
      data: orderDetailData,
    });
  }

  console.log('Order details seeded successfully.');
};