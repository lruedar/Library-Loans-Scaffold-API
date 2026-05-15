/* eslint-disable prettier/prettier */
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ItemType } from '../item.entity/item.entity';

export class FindItemDto {
    @ApiPropertyOptional({description: 'Buscar por título'})
    @IsOptional()
    @IsString()
    title?: string;

    @ApiPropertyOptional({description: 'Buscar por tipo'})
    @IsOptional()
    @IsEnum(ItemType)
    type?: string;

    @ApiPropertyOptional({description: 'Buscar por código'})
    @IsOptional()
    @IsString()
    code?: string;
}