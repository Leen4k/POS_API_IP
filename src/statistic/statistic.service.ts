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

    const orders = await this.prisma.order.findMany({
      where: {
        purchaseDate: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    const totalRevenueToday = orders.reduce(
      (acc, order) => acc + order.totalPrice,
      0,
    );
    const totalOrdersToday = orders.length;

    return {
      message: 'Statistic Fetched Successfully',
      data: {
        totalRevenueToday,
        totalOrdersToday,
      },
    };
  }
}
