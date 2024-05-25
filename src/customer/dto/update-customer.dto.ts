import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateCustomerDto } from './create-customer.dto';
import { IsString, IsOptional, IsNumber, IsISO8601 } from 'class-validator';

export class UpdateCustomerDto extends PartialType(CreateCustomerDto) {
  
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
