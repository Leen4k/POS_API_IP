import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/roles.enum';

@ApiTags('Employee Endpoints')
@Controller('employee')
@UseGuards(RolesGuard)
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Roles(Role.Admin)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin Only' })
  @Post()
  async create(@Body() createEmployeeDto: CreateEmployeeDto) {
    try {
      return {
        message: 'Employee created successfully',
        data: await this.employeeService.create(createEmployeeDto),
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  @Roles(Role.Admin)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin Only' })
  async findAll() {
    try {
      const employees = await this.employeeService.findAll();
      return { message: 'Employees fetch successfully', data: employees };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  @Roles(Role.Admin)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin Only' })
  async findOne(@Param('id') id: string) {
    try {
      const employee = await this.employeeService.findOne(id);
      return {
        message: 'Employee fetched successfully',
        data: employee,
      };
    } catch (error) {
      throw new HttpException(
        error.message,
        error instanceof NotFoundException
          ? HttpStatus.NOT_FOUND
          : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':id')
  @Roles(Role.Admin)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin Only' })
  async update(
    @Param('id') id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ) {
    try {
      const employee = await this.employeeService.update(id, updateEmployeeDto);
      return {
        message: 'Employee updated successfully',
        data: employee,
      };
    } catch (error) {
      throw new HttpException(
        error.message,
        error instanceof NotFoundException
          ? HttpStatus.NOT_FOUND
          : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  @Roles(Role.Admin)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin Only' })
  async remove(@Param('id') id: string) {
    try {
      const employee = await this.employeeService.remove(id);
      return {
        message: 'Employee deleted successfully',
        data: employee,
      };
    } catch (error) {
      throw new HttpException(
        error.message,
        error instanceof NotFoundException
          ? HttpStatus.NOT_FOUND
          : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
