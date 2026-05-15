/* eslint-disable prettier/prettier */
import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/user.entity/user.entity';
import { Item } from '../../items/item.entity/item.entity';

export enum LoanStatus {
    ACTIVE   = 'active',
    RETURNED = 'returned',
    OVERDUE  = 'overdue',
}

@Entity({ name: 'loans' })
@Index(['userId', 'status'])
export class Loan {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'uuid' })
    userId!: string;

    @ManyToOne(() => User, { onDelete: 'RESTRICT' })
    @JoinColumn({ name: 'userId' })
    user?: User;

    @Column({ type: 'uuid' })
    itemId!: string;

    @ManyToOne(() => Item, { onDelete: 'RESTRICT' })
    @JoinColumn({ name: 'itemId' })
    item?: Item;

    @Column({ type: 'timestamp' })
    borrowedAt!: Date;

    @Column({ type: 'timestamp' })
    dueDate!: Date;

    @Column({ type: 'timestamp', nullable: true })
    returnedAt!: Date | null;

    @Column({ type: 'enum', enum: LoanStatus, default: LoanStatus.ACTIVE })
    status!: LoanStatus;

    @Column({ type: 'numeric', precision: 10, scale: 2, default: 0 })
    fineAmount!: number;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}