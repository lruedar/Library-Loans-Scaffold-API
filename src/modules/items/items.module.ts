/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemsService } from './items.service';
import { Item } from './item.entity/item.entity';
import { ItemsController } from './items.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Item])],
    controllers: [ItemsController],
    providers: [ItemsService],
    exports: [ItemsService],
})
export class ItemsModule {}