import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';
import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class UpdateProductDto extends PartialType(CreateProductDto) {

    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsString()
    description: string;

    @ApiProperty()
    @IsString()
    photo: string;

    @ApiProperty()
    @IsString()
    categoryId: string;

    @ApiProperty()
    @IsNumber()
    stock: number;

    @ApiProperty()
    @IsNumber()
    price: number;

    @ApiProperty()
    @IsBoolean()    
    isAvailable: boolean;

    @ApiProperty()
    @IsString()
    promotion: string;

}
