/* eslint-disable prettier/prettier */
import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Loan, LoanStatus } from './loan.entity/loan.entity';
import { ItemsService } from '../items/items.service';
import { UsersService } from '../users/users.service';
import { CreateLoanDto } from './loans.dto/create-loan.dto';
import { FindLoanDto } from './loans.dto/find-loan.dto';
import { AuthenticatedUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '@modules/users/user.entity/user.entity';

@Injectable()
export class LoansService {
    constructor(
        @InjectRepository(Loan)
        private readonly loanRepo: Repository<Loan>,
        private readonly itemsService: ItemsService,
        private readonly usersService: UsersService,
        private readonly configService: ConfigService,
    ) {}

    async findAll(filters: FindLoanDto, actor: AuthenticatedUser): Promise<Loan[]> {
        const where: any = {};

        if (actor.role === UserRole.ADMIN || actor.role === UserRole.LIBRARIAN) {
            if (filters.userId) where.userId = filters.userId;
            if (filters.status) where.status = filters.status;
        } else {
            where.userId = actor.id;
            if (filters.status) where.status = filters.status;
        }

        return this.loanRepo.find({ where, relations: ['user', 'item'] });
    }

    async findById(id: string, actor: AuthenticatedUser): Promise<Loan> {
        const loan = await this.loanRepo.findOne({
            where: { id },
            relations: ['user', 'item'],
        });
        if (!loan) throw new NotFoundException(`El prestamo con ID ${id} no existe`);

        if (actor.role !== UserRole.ADMIN && actor.role !== UserRole.LIBRARIAN && loan.userId !== actor.id) {
            throw new ForbiddenException('No tienes permiso para acceder a este préstamo');
        }

        return loan;
    }

    async create(dto: CreateLoanDto, actor: AuthenticatedUser): Promise<Loan> {
        const maxActiveLoans = this.configService.get<number>('loans.maxActiveLoans', 3);
        const maxLoanDays = this.configService.get<number>('loans.maxLoanDays', 30);

        const user = await this.usersService.findById(actor.id);
        const item = await this.itemsService.findById(dto.itemId);

        const loanActivo = await this.loanRepo.findOne({
            where: { itemId: dto.itemId, status: LoanStatus.ACTIVE },
        });
        if (loanActivo) throw new BadRequestException('Este item ya está prestado');

        const prestamosActivos = await this.loanRepo.count({
            where: { userId: actor.id, status: LoanStatus.ACTIVE },
        });
        if (prestamosActivos >= maxActiveLoans) {
            throw new BadRequestException(`Sus préstamos superan el límite de préstamos activos (${maxActiveLoans})`);
        }

        const borrowedAt = new Date();
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + maxLoanDays);

        const loan = this.loanRepo.create({
            userId: user.id,
            itemId: item.id,
            borrowedAt,
            dueDate,
            status: LoanStatus.ACTIVE,
            fineAmount: 0,
        });
        return this.loanRepo.save(loan);
    }

    async return(id: string, actor: AuthenticatedUser): Promise<Loan> {
        const dailyFineRate = this.configService.get<number>('loans.dailyFineRate', 0.5);
        const loan = await this.findById(id, actor);

        if (loan.status === LoanStatus.RETURNED) throw new BadRequestException('Este prestamo ya ha sido devuelto');

        const hoy = new Date();
        let fineAmount = 0;

        if (hoy > loan.dueDate) {
            const diasVencido = Math.ceil(
                (hoy.getTime() - loan.dueDate.getTime()) / (1000 * 60 * 60 * 24)
            );
            fineAmount = diasVencido * dailyFineRate;
        }

        loan.returnedAt = hoy;
        loan.status = LoanStatus.RETURNED;
        loan.fineAmount = fineAmount;

        return this.loanRepo.save(loan);
    }
}