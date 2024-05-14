import { PrismaClient } from '@prisma/client';
import productsData from './data/products';

const prisma = new PrismaClient();

const seedProducts = async () => {
      // Seed products
      for (const productData of productsData) {
        await prisma.product.create({
          data: productData,
        });
      }
};

export default seedProducts;