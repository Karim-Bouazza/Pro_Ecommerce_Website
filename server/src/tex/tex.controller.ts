import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import { TexService } from './tex.service';
import { CreateTexDto } from './dto/create-tex.dto';
import { UpdateTexDto } from './dto/update-tex.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { RolesAuthGuard } from 'src/auth/guards/roles.guard';

@Controller('tex')
export class TexController {
  constructor(private readonly texService: TexService) {}

  // ~/tex
  @Post()
  @Roles(UserRole.Admin)
  @UseGuards(RolesAuthGuard)
  create(@Body() createTexDto: CreateTexDto) {
    return this.texService.create(createTexDto);
  }

  // ~/tex
  @Get()
  @Roles(UserRole.Admin)
  @UseGuards(RolesAuthGuard)
  findAll() {
    return this.texService.findAll();
  }

  // ~/tex/:id
  @Get(':id')
  @Roles(UserRole.Admin)
  @UseGuards(RolesAuthGuard)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.texService.findOne(id);
  }

  // ~/tex/:id
  @Put(':id')
  @Roles(UserRole.Admin)
  @UseGuards(RolesAuthGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTexDto: UpdateTexDto,
  ) {
    return this.texService.update(id, updateTexDto);
  }

  // ~/tex/:id
  @Delete(':id')
  @Roles(UserRole.Admin)
  @UseGuards(RolesAuthGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.texService.remove(id);
  }
}
