/* eslint-disable prettier/prettier */
import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { LoanStatus } from '../loan.entity/loan.entity';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FindLoanDto {
    @ApiPropertyOptional({description: 'Buscar por ID del usuario'})
    @IsOptional()
    @IsUUID()
    userId?: string;

    @ApiPropertyOptional({enum: LoanStatus})
    @IsOptional()
    @IsEnum(LoanStatus)
    status?: LoanStatus;
}