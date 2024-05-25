import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsISO8601, IsDate } from 'class-validator';

export class CreateCustomerDto {
    @ApiProperty()
    @IsString()
    phone: string;
  
    @ApiProperty()
    @IsString()
    name: string;
  
    @ApiProperty()
    @IsNumber()
    loyaltyPoints: number;
}
