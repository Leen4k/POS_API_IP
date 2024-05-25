import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateCategoryDto {
    @IsString()
    id: string;
    
    @ApiProperty()
    @IsString()
    name: string;
    
    @ApiProperty()
    @IsString()
    photo: string;
}
