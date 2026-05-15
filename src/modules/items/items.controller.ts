/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ItemsService } from './items.service';
import { CreateItemDto } from './items.dto/create-item.dto';
import { UpdateItemDto } from './items.dto/update-item.dto';
import { FindItemDto } from './items.dto/find-item.dto';
import { Roles } from '@common/decorators/roles.decorator';
import { UserRole } from '@modules/users/user.entity/user.entity';

@ApiTags('items')
@ApiBearerAuth()
@Controller('items')
export class ItemsController {
    constructor(private readonly itemsService: ItemsService) {}

    @Get()
    findAll(@Query() filters: FindItemDto) {
        return this.itemsService.findAll(filters);
    }

    @Get(':id')
    findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.itemsService.findById(id);
    }

    @Post()
    @Roles(UserRole.LIBRARIAN)
    @HttpCode(HttpStatus.CREATED)
    create(@Body() dto: CreateItemDto) {
        return this.itemsService.create(dto);
    }

    @Patch(':id')
    @Roles(UserRole.LIBRARIAN)
    update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateItemDto) {
        return this.itemsService.update(id, dto);
    }

    @Delete(':id')
    @Roles(UserRole.LIBRARIAN)
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('id', ParseUUIDPipe) id: string) {
        return this.itemsService.remove(id);
    }
}