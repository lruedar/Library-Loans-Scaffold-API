/* eslint-disable prettier/prettier */
import { User } from '../../users/user.entity/user.entity';
import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';


@Entity({ name: 'refresh_tokens' })
export class RefreshToken {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'uuid' })
    userId!: string;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user?: User;

    @Index({ unique: true })
    @Column({ type: 'varchar', length: 512 })
    token!: string;

    @Column({ type: 'timestamptz' })
    expiresAt!: Date;

    @Column({ type: 'timestamptz', nullable: true })
    revokedAt!: Date | null;

    @CreateDateColumn()
    createdAt!: Date;
}