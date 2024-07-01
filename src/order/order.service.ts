import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  async createOrder(createOrderDto: CreateOrderDto) {
    const { customerId, employeeId, paidCash, orderDetails } = createOrderDto;

    // Validate customer and employee existence
    const customer = await this.prisma.customer.findUnique({
      where: { id: customerId },
    });
    if (!customer) throw new NotFoundException('Customer not found');

    const employee = await this.prisma.employee.findUnique({
      where: { id: employeeId },
    });
    if (!employee) throw new NotFoundException('Employee not found');

    // Calculate total price and validate product availability
    let totalPrice = 0;
    const orderItemsWithPrice = [];

    for (const orderItem of orderDetails) {
      if (orderItem.quantity <= 0) {
        throw new BadRequestException('Quantity must be greater than zero');
      }
      const product = await this.prisma.product.findUnique({
        where: { id: orderItem.productId },
      });
      if (
        !product ||
        !product.isAvailable ||
        product.stock < orderItem.quantity
      ) {
        throw new BadRequestException(
          `Product ${orderItem.productId} is not available or out of stock`,
        );
      }
      totalPrice += product.price * orderItem.quantity;
      orderItemsWithPrice.push({
        ...orderItem,
        price: product.price,
      });
    }

    if (paidCash < totalPrice) {
      throw new BadRequestException('Paid cash is less than total price');
    }

    const returnCash = paidCash - totalPrice;

    // Create order, order details, and purchase history in a transaction
    const order = await this.prisma.$transaction(async (prisma) => {
      const newOrder = await prisma.order.create({
        data: {
          customerId,
          employeeId,
          totalPrice,
          paidCash,
          returnCash,
          orderDetails: {
            create: orderItemsWithPrice.map((orderItem) => ({
              productId: orderItem.productId,
              quantity: orderItem.quantity,
            })),
          },
        },
      });

      // Create purchase history records
      await prisma.purchaseHistory.createMany({
        data: orderItemsWithPrice.map((orderItem) => ({
          customerId,
          productId: orderItem.productId,
          purchaseDate: new Date(),
          price: orderItem.price,
        })),
      });

      // Update product stock
      for (const orderItem of orderItemsWithPrice) {
        await prisma.product.update({
          where: { id: orderItem.productId },
          data: { stock: { decrement: orderItem.quantity } },
        });
      }

      return newOrder;
    });

    return order;
  }

  async findAll({ page, size }: { page?: number; size?: number }) {
    try {
      const skip = Number((page - 1) * size);
      const orders = await this.prisma.order.findMany({
        skip,
        take: Number(size || 10),
        include: {
          orderDetails: {
            include: {
              product: true,
            },
          },
          customer: true,
          employee: true,
        },
        orderBy: {
          purchaseDate: 'desc',
        },
      });

      const totalOrders = await this.prisma.order.count();
      const totalPages = Math.ceil(totalOrders / size);

      return {
        orders,
        pagination: {
          totalOrders,
          totalPages,
          currentPage: page,
          pageSize: size,
        },
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Cannot fetch orders');
    }
  }

  async findOne(id: string) {
    try {
      const order = await this.prisma.order.findUnique({
        where: { id },
      });
      if (!order) {
        throw new NotFoundException(`Order with ID ${id} not found`);
      }
      return order;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error fetching order');
    }
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  async deleteOrder(id: string) {
    try {
      // Fetch the existing order
      const order = await this.prisma.order.findUnique({
        where: { id },
        include: { orderDetails: true },
      });

      if (!order) {
        throw new NotFoundException('Order not found');
      }

      // Calculate the time difference
      const createdAt = new Date(order.purchaseDate);
      const currentTime = new Date();
      const timeDifferenceInMinutes =
        (currentTime.getTime() - createdAt.getTime()) / (1000 * 60);

      // Check if the time difference exceeds the maximum allowed time (10 minutes)
      if (timeDifferenceInMinutes > 10) {
        throw new ForbiddenException(
          'Order cannot be deleted after 10 minutes of creation',
        );
      }

      // Start a transaction to ensure atomicity
      await this.prisma.$transaction(async (prisma) => {
        // Increment product quantity back
        for (const detail of order.orderDetails) {
          await prisma.product.update({
            where: { id: detail.productId },
            data: {
              stock: {
                increment: detail.quantity,
              },
            },
          });
        }

        // Delete order details
        await prisma.orderDetail.deleteMany({
          where: { orderId: id },
        });

        // Delete associated purchase history
        // await prisma.purchaseHistory.deleteMany({
        //   where: {
        //     customerId: order.customerId,
        //     productId: { in: order.orderDetails.map(detail => detail.productId) }
        //   }
        // });

        // Delete the order
        await prisma.order.delete({
          where: { id },
        });
      });
    } catch (error) {
      throw new InternalServerErrorException(
        error.message || 'Cannot delete order',
      );
    }
  }
}
