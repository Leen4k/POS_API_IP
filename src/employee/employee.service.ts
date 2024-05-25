import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

export const roundOfHashing = 10;

@Injectable()
export class EmployeeService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createEmployeeDto: CreateEmployeeDto) {
    try {
      const hashedPassword = await bcrypt.hash(
        createEmployeeDto.password,
        roundOfHashing,
      );
      createEmployeeDto.password = hashedPassword;
      return await this.prisma.employee.create({ data: createEmployeeDto });
    } catch (error) {
      throw new InternalServerErrorException('Cannot create employee');
    }
  }

  async findAll() {
    try {
      return await this.prisma.employee.findMany();
    } catch (error) {
      throw new InternalServerErrorException('Cannot fetch employees');
    }
  }

  async findOne(id: string) {
    try {
      const employee = await this.prisma.employee.findUnique({
        where: { id },
      });
      if (!employee) {
        throw new NotFoundException(`Employee with ID ${id} not found`);
      }
      return employee;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error fetching employee');
    }
  }

  async update(id: string, updateEmployeeDto: UpdateEmployeeDto) {
    try {
      const employee = await this.prisma.employee.findUnique({ where: { id } });
      if (!employee) {
        throw new NotFoundException(`Employee with ID ${id} not found`);
      }
      if (updateEmployeeDto.password) {
        updateEmployeeDto.password = await bcrypt.hash(
          updateEmployeeDto.password,
          roundOfHashing,
        );
      }
      return await this.prisma.employee.update({
        where: { id },
        data: updateEmployeeDto,
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error updating employee');
    }
  }

  async remove(id: string) {
    try {
      const employee = await this.prisma.employee.findUnique({ where: { id } });
      if (!employee) {
        throw new NotFoundException(`Employee with ID ${id} not found`);
      }
      return await this.prisma.employee.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error deleting employee');
    }
  }
}
