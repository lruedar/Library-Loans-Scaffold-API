/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Loan } from './loan.entity/loan.entity';
import { LoansService } from './loans.service';
import { LoansController } from './loans.controller';
import { ItemsModule } from '@modules/items/items.module';
import { UsersModule } from '@modules/users/users.module';

@Module({
    imports: [TypeOrmModule.forFeature([Loan]), ItemsModule, UsersModule],
    controllers: [LoansController],
    providers: [LoansService,],
    exports: [LoansService],
})
export class LoansModule {}