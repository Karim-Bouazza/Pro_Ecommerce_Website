import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, Put } from '@nestjs/common';
import { RequestService } from './request.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { RolesAuthGuard } from 'src/auth/guards/roles.guard';

@Controller('request-product')
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  // ~/request-product/create
  @Post('create')
  @UseGuards(JwtAuthGuard)
  create(@CurrentUser() payload ,@Body() createRequestDto: CreateRequestDto) {
    return this.requestService.create(payload.id, createRequestDto);
  }

  // ~/request-product/admin-requests
  @Get('admin-requests')
  @Roles(UserRole.Admin)
  @UseGuards(RolesAuthGuard)
  findAll() {
    return this.requestService.findAll();
  }

  // ~/request-product/requests-products
  @Get('requests-products')
  @UseGuards(JwtAuthGuard)
  findAllByUser(@CurrentUser() payload) {
     return this.requestService.findAllByUser(payload.id)
  }

  // ~/request-product/:id
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@CurrentUser() payload, @Param('id', ParseIntPipe) id: number) {
    return this.requestService.findOne(payload, id);
  }

  // ~/request-product/:id
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(@CurrentUser() payload, @Param('id', ParseIntPipe) id: number, @Body() updateRequestDto: UpdateRequestDto) {
    return this.requestService.update(payload, id, updateRequestDto);
  }

  // ~/request-product/:id
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@CurrentUser() payload, @Param('id', ParseIntPipe) id: number) {
    return this.requestService.remove(payload, id);
  }
}
