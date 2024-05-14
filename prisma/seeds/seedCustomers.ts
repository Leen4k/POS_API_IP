import { PrismaClient } from '@prisma/client';
import customersData from './data/customers';

const prisma = new PrismaClient();

const seedCustomers = async () => {
    for (const customerData of customersData) {
      await prisma.customer.create({
        data: customerData,
      });
    }
};

export default seedCustomers;