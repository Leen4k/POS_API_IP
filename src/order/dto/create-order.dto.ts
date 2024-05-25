import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsDate, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { OrderDetailDto } from './order-detail.dto';
import { Type } from "@nestjs/class-transformer";

export class CreateOrderDto {
  @ApiProperty()
  @IsString()
  customerId: string;

  @ApiProperty()
  @IsString()
  employeeId: string;

  @ApiProperty()
  @IsNumber()
  paidCash: number;


  // @ApiProperty()
  // @IsOptional()
  // @IsDate()
  // createdAt: Date;

  @ApiProperty({ isArray: true, type: OrderDetailDto })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderDetailDto)
  orderDetails: OrderDetailDto[];
}
