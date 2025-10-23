import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminsService } from './admins.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { RolesAuthGuard } from 'src/auth/guards/roles.guard';
import { CurrentAdmin } from './decorators/current-user.decorator';

@Controller('/admins')
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @Get('currentAdmin')
  @Roles(UserRole.Admin)
  @UseGuards(RolesAuthGuard)
  public currentAdmin(@CurrentAdmin() payload) {
    return this.adminsService.findOne(payload.id);
  }

  @Post('/create')
  @Roles(UserRole.Admin)
  @UseGuards(RolesAuthGuard)
  public CreateUser(@Body() body: CreateAdminDto) {
    return this.adminsService.create(body);
  }

  @Get('/users')
  @Roles(UserRole.Admin)
  @UseGuards(RolesAuthGuard)
  public FindAllUsers(
    @Query('pageNumber', ParseIntPipe) pageNumber: number,
    @Query('userPerPage', ParseIntPipe) userPerPage: number,
    @Query('usersName') usersName?: string,
    @Query('usersOrder') usersOrder?: string,
    @Query('role') userRoles?: UserRole
  ) {
    return this.adminsService.findAll(pageNumber, userPerPage, usersName, usersOrder, userRoles);
  }

  @Get('/:id')
  @Roles(UserRole.Admin)
  @UseGuards(RolesAuthGuard)
  public FindOneUser(@Param('id', ParseIntPipe) id: number) {
    return this.adminsService.findOne(id);
  }

  @Put('/:id')
  @Roles(UserRole.Admin)
  @UseGuards(RolesAuthGuard)
  public UpdateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateAdminDto,
  ) {
    return this.adminsService.update(id, body);
  }

  @Delete('/:id')
  @Roles(UserRole.Admin)
  @UseGuards(RolesAuthGuard)
  public RemoveUser(@Param('id', ParseIntPipe) id: number) {
    return this.adminsService.remove(id);
  }
}
