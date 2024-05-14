import { PrismaClient } from '@prisma/client';
import { purchaseHistoryData } from './data/purchaseHistories';

const prisma = new PrismaClient();

export const seedPurchaseHistories = async () => {
  // Seed purchase histories
  for (const purchaseData of purchaseHistoryData) {
    await prisma.purchaseHistory.create({
      data: purchaseData,
    });
  }

  console.log('Purchase histories seeded successfully.');
};
