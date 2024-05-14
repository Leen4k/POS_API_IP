import { PrismaClient } from '@prisma/client';
import categories from './data/categories';

const prisma = new PrismaClient();

const seedCategories = async () => {
  for (const category of categories) {
    await prisma.category.upsert({
      where: { id: category.id },
      update: category,
      create: category
    });
  }
};

export default seedCategories;
