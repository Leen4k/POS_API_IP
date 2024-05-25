import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService){}

  async create(createProductDto: CreateProductDto) {
    try{
      const category = await this.prisma.category.findUnique({
        where: { id: createProductDto.categoryId },
      });

      if (!category) {
        throw new BadRequestException('Invalid categoryId');
      }

      return await this.prisma.product.create(
        {data: createProductDto}
      )
    }catch(error){
      if( error instanceof BadRequestException){
        throw new BadRequestException(error);
      }
      throw new InternalServerErrorException("Cannot create product");
    }
  }

  async findAll(query: { page?: number; pageSize?: number; search?: string; categoryId?: string }) {
    const page = query.page ? Number(query.page) : 1;
    const pageSize = query.pageSize ? Number(query.pageSize) : 10;
    const search = query.search || '';
    const categoryId = query.categoryId || '';

    const skip = (page - 1) * pageSize;
    const take = pageSize;

    try {
      const whereCondition: any = {
        AND: [
          {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } },
            ],
          },
        ],
      };

      if (categoryId) {
        whereCondition.AND.push({ categoryId: categoryId });
      }

      const [products, total] = await Promise.all([
        this.prisma.product.findMany({
          where: whereCondition,
          skip,
          take,
          include: {
            promotions: true
          }
        }),
        this.prisma.product.count({
          where: whereCondition,
        }),
      ]);

      return {
        data: products,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      };
    } catch (error) {
      throw new InternalServerErrorException('Error fetching products');
    }
  }

  async findOne(id: string) {
    try {
      const product = await this.prisma.product.findUnique({
        where: { id },
      });
      if (!product) {
        throw new NotFoundException(`Product with ID ${id} not found`);
      }
      return product;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error fetching product');
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    try {
      const category = await this.prisma.category.findUnique({
        where: { id: updateProductDto.categoryId },
      });

      if (!category) {
        throw new BadRequestException('Invalid categoryId');
      }
      const product = await this.prisma.product.findUnique({ where: { id } });
      if (!product) {
        throw new NotFoundException(`Product with ID ${id} not found`);
      }
      return await this.prisma.product.update({
        where: { id },
        data: updateProductDto,
      });
    } catch (error) {
      if (error instanceof BadRequestException){
        throw new BadRequestException(error);
      }
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error updating product');
    }
  }

  async remove(id: string) {
    try {
      const product = await this.prisma.product.findUnique({ where: { id } });
      if (!product) {
        throw new NotFoundException(`Product with ID ${id} not found`);
      }
      return await this.prisma.product.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error deleting product');
    }
  }
}
