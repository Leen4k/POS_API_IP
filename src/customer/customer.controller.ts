import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  InternalServerErrorException,
  HttpException,
  HttpStatus,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { RolesGuard } from 'src/auth/roles.guard';
import { Role } from 'src/auth/roles.enum';
import { Roles } from 'src/auth/roles.decorator';

@ApiTags('Customer Endpoints')
@Controller('customer')
@UseGuards(RolesGuard)
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  @Roles(Role.Admin, Role.Staff)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new customer' })
  @ApiResponse({
    status: 201,
    description: 'The customer has been successfully created.',
  })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async create(@Body() createCustomerDto: CreateCustomerDto) {
    try {
      const customer = await this.customerService.create(createCustomerDto);
      return {
        message: 'Customer created successfully',
        data: customer,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  @Roles(Role.Admin, Role.Staff)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get all customers',
    description:
      'Fetch all customers. **Also associated with purchase history.',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully fetched all customers.',
  })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async findAll() {
    try {
      const customers = await this.customerService.findAll();
      return {
        message: 'Customers fetched successfully',
        data: customers,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  @Roles(Role.Admin, Role.Staff)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a customer by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the customer to fetch' })
  @ApiResponse({
    status: 200,
    description: 'Successfully fetched the customer.',
  })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async findOne(@Param('id') id: string) {
    try {
      const customer = await this.customerService.findOne(id);
      return {
        message: 'Customer fetched successfully',
        data: customer,
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
  @Roles(Role.Admin, Role.Staff)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a customer' })
  @ApiParam({ name: 'id', description: 'The ID of the customer to update' })
  @ApiResponse({
    status: 200,
    description: 'Successfully updated the customer.',
  })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async update(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    try {
      const customer = await this.customerService.update(id, updateCustomerDto);
      return {
        message: 'Customer updated successfully',
        data: customer,
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
  @Roles(Role.Admin, Role.Staff)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a customer' })
  @ApiParam({ name: 'id', description: 'The ID of the customer to delete' })
  @ApiResponse({
    status: 200,
    description: 'Successfully deleted the customer.',
  })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async remove(@Param('id') id: string) {
    try {
      const customer = await this.customerService.remove(id);
      return {
        message: 'Customer deleted successfully',
        data: customer,
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
