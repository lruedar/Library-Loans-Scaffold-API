/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator';
import { IsUUID } from 'class-validator';

export class CreateLoanDto {
    @ApiProperty()
    @IsUUID()
    itemId!: string;
}