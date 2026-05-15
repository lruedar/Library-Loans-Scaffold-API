/* eslint-disable prettier/prettier */
import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LoansService } from './loans.service';
import { CreateLoanDto } from './loans.dto/create-loan.dto';
import { FindLoanDto } from './loans.dto/find-loan.dto';
import { CurrentUser, AuthenticatedUser } from '../../common/decorators/current-user.decorator';

@ApiTags('loans')
@ApiBearerAuth()
@Controller('loans')
export class LoansController {
    constructor(private readonly loansService: LoansService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Body() dto: CreateLoanDto, @CurrentUser() actor: AuthenticatedUser) {
        return this.loansService.create(dto, actor);
    }

    @Get()
    findAll(@Query() filters: FindLoanDto, @CurrentUser() actor: AuthenticatedUser) {
        return this.loansService.findAll(filters, actor);
    }

    @Get(':id')
    findOne(@Param('id', new ParseUUIDPipe()) id: string, @CurrentUser() actor: AuthenticatedUser) {
        return this.loansService.findById(id, actor);
    }

    @Patch(':id/return')
    @HttpCode(HttpStatus.OK)
    returnLoan(@Param('id', new ParseUUIDPipe()) id: string, @CurrentUser() actor: AuthenticatedUser) {
        return this.loansService.return(id, actor);
    }
}