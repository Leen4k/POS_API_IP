import { PrismaClient } from '@prisma/client';
import employeesData from './data/employees';
import * as bcrypt from 'bcrypt';
const roundOfHashing = 10;

const prisma = new PrismaClient();

const seedEmployees = async () => {
  for (const employeeData of employeesData) {
    employeeData.password = await bcrypt.hash(
      employeeData.password,
      roundOfHashing,
    );
    await prisma.employee.create({
      data: employeeData,
    });
  }
};

export default seedEmployees;
