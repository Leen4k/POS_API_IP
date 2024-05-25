import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CustomerService {
  constructor(private readonly prisma: PrismaService){}

  async create(createCustomerDto: CreateCustomerDto) {
    try {
      return await this.prisma.customer.create({
        data: createCustomerDto,
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findAll() {
    try{
      return await this.prisma.customer.findMany(
        {
          include: {
            purchaseHistory: true
          }
        }
      );
    }catch(error){
      throw new InternalServerErrorException("Cannot fetch customers")
    }
  }

  async findOne(id: string) {
    try {
      const customer = await this.prisma.customer.findUnique({
        where: { id },
        include: { purchaseHistory: true }
      });
      if (!customer) {
        throw new NotFoundException(`Customer with ID ${id} not found`);
      }
      return customer;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error fetching customer');
    }
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto) {
    try {
      const customer = await this.prisma.customer.findUnique({ where: { id } });
      if (!customer) {
        throw new NotFoundException(`Customer with ID ${id} not found`);
      }
      return await this.prisma.customer.update({
        where: { id },
        data: updateCustomerDto,
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error updating customer');
    }
  }

  async remove(id: string) {
    try {
      const customer = await this.prisma.customer.findUnique({ where: { id } });
      if (!customer) {
        throw new NotFoundException(`Customer with ID ${id} not found`);
      }
      return await this.prisma.customer.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error deleting customer');
    }
  }
}
