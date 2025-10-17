import { Controller, Body, Get, UseGuards, Put, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // ~/users
  @Get()
  @UseGuards(JwtAuthGuard)
  getCurrentUser(@CurrentUser() payload) {
    return this.usersService.findOne(payload.id);
  }

  // ~/users/update
  @Put('update')
  @UseGuards(JwtAuthGuard)
  update(@CurrentUser() payload, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(payload.id, updateUserDto);
  }

  // ~/users/delete
  @Delete('delete')
  @UseGuards(JwtAuthGuard)
  remove(@CurrentUser() payload) {
    return this.usersService.remove(payload.id);
  }
}
