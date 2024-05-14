import { PrismaClient } from '@prisma/client';
import employeesData from './data/employees';

const prisma = new PrismaClient();

const seedEmployees = async () => {
    for (const employeeData of employeesData) {
      await prisma.employee.create({
        data: employeeData,
      });
    }
};

export default seedEmployees;