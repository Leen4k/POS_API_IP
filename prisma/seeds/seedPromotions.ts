// seedPromotions.ts

import { PrismaClient } from '@prisma/client';
import { promotionsData } from './data/promotions'

const prisma = new PrismaClient();

export const seedPromotions = async () => {
  // Seed promotions
  for (const promotionData of promotionsData) {
    await prisma.promotion.create({
      data: promotionData,
    });
  }

  console.log('Promotions seeded successfully.');
};
