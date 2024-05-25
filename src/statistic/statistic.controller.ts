import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { StatisticService } from './statistic.service';
import { CreateStatisticDto } from './dto/create-statistic.dto';
import { UpdateStatisticDto } from './dto/update-statistic.dto';
import { RolesGuard } from 'src/auth/roles.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/roles.enum';

@Controller('statistic')
@UseGuards(RolesGuard)
export class StatisticController {
  constructor(private readonly statisticService: StatisticService) {}

  @Get()
  @Roles(Role.Admin)
  // @Roles(Role.Admin, Role.Staff)  ** to be discuss....
  @ApiBearerAuth()
  async getTodayStatistics() {
    return this.statisticService.getTodayStatistics();
  }
}
