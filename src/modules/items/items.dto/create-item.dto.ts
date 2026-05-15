/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { ItemType } from '../item.entity/item.entity';

export class CreateItemDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(32)
    @Matches(/^[A-Z]{2}-\d{4}$/, { message: 'El código debe tener el formato BK-0042' })
    code!: string;

    @ApiProperty({ description: 'Título del libro', example: 'El Gran Gatsby' })
    @IsString()
    @IsNotEmpty()
    @MinLength(1)
    @MaxLength(255)
    title!: string;

    @IsEnum(ItemType)
    type!: ItemType;
}