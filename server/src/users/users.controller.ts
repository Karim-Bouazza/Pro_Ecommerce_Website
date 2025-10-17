import { Controller, Body, Get, UseGuards, Put, Delete, ParseIntPipe, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // ~/user/me
  @Get('me')
  @UseGuards(JwtAuthGuard)
  getCurrentUser(@CurrentUser() payload) {
    return this.usersService.findCurrentUser(payload.id);
  }

  // ~/user/update
  @Put('update')
  @UseGuards(JwtAuthGuard)
  update(@CurrentUser() payload, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(payload.id, updateUserDto);
  }

  // ~/user/delete
  @Delete('delete')
  @UseGuards(JwtAuthGuard)
  remove(@CurrentUser() payload) {
    return this.usersService.remove(payload.id);
  }

  // ~/user/:id
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  getUserByOtherUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findUserByOtherUser(id);
  }
}
