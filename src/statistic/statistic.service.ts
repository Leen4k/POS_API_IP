import { Injectable } from '@nestjs/common';
import { CreateStatisticDto } from './dto/create-statistic.dto';
import { UpdateStatisticDto } from './dto/update-statistic.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StatisticService {
  constructor(private readonly prisma: PrismaService) {}
  async getTodayStatistics() {
    const startOfDay = new Date(new Date().setHours(0, 0, 0, 0));
    const endOfDay = new Date(new Date().setHours(23, 59, 59, 999));
    const startOfMonth = new Date(new Date().setDate(1));
    const endOfMonth = new Date(new Date().setDate(1));
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    endOfMonth.setDate(endOfMonth.getDate() - 1);

    const todayOrders = await this.prisma.order.findMany({
      where: {
        purchaseDate: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    const monthOrders = await this.prisma.order.findMany({
      where: {
        purchaseDate: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
    });

    const totalRevenueToday = todayOrders.reduce(
      (acc, order) => acc + order.totalPrice,
      0,
    );
    const totalOrdersToday = todayOrders.length;

    const totalRevenueThisMonth = monthOrders.reduce(
      (acc, order) => acc + order.totalPrice,
      0,
    );
    const totalOrdersThisMonth = monthOrders.length;

    const totalCustomers = await this.prisma.customer.count();

    const salesDataToday = todayOrders.reduce((acc, order) => {
      const dayOfWeek = new Date(order.purchaseDate).toLocaleDateString(
        'en-US',
        { weekday: 'short' },
      );
      acc.push({ day: dayOfWeek, value: order.totalPrice });
      return acc;
    }, []);

    const salesDataThisMonth = monthOrders.reduce((acc, order) => {
      const dayOfMonth = new Date(order.purchaseDate).getDate();
      acc.push({ day: dayOfMonth, value: order.totalPrice });
      return acc;
    }, []);

    return {
      message: 'Statistic Fetched Successfully',
      data: {
        totalRevenueToday,
        totalOrdersToday,
        totalRevenueThisMonth,
        totalOrdersThisMonth,
        totalCustomers,
        salesDataToday,
        salesDataThisMonth,
      },
    };
  }
}
