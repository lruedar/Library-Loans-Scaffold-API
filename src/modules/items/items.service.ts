/* eslint-disable prettier/prettier */
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item } from './item.entity/item.entity';
import { CreateItemDto } from './items.dto/create-item.dto';
import { UpdateItemDto } from './items.dto/update-item.dto';
import { FindItemDto } from './items.dto/find-item.dto';

@Injectable()
export class ItemsService {
    constructor(
        @InjectRepository(Item)
        private readonly itemRepo: Repository<Item>,
    ) {}

    async findAll(filters: FindItemDto): Promise<Item[]> {
        const where: any = { isActive: true };
        if (filters.title) where.title = filters.title;
        if (filters.code) where.code = filters.code;
        if (filters.type) where.type = filters.type;
        return this.itemRepo.find({ where });
    }

    async findById(id: string): Promise<Item> {
        const item = await this.itemRepo.findOne({ where: { id } });
        if (!item || !item.isActive) throw new NotFoundException(`El item con ID ${id} no existe/está inactivo`);
        return item;
    }

    async create(dto: CreateItemDto): Promise<Item> {
        const existe = await this.itemRepo.findOne({ where: { code: dto.code } });
        if (existe) throw new ConflictException('El código especificado ya existe');
        const item = this.itemRepo.create(dto);
        return this.itemRepo.save(item);
    }

    async update(id: string, dto: UpdateItemDto | Partial<Item>): Promise<Item> {
        const item = await this.findById(id);
        Object.assign(item, dto);
        return this.itemRepo.save(item);
    }

    async remove(id: string): Promise<void> {
        const item = await this.findById(id);
        item.isActive = false;
        await this.itemRepo.save(item);
    }
}