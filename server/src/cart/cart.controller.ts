import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { RolesAuthGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { CreateCartDto } from './dto/create-cart.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  // ~/cart/create
  @Post('create')
  @Roles(UserRole.User)
  @UseGuards(RolesAuthGuard)
  create(@CurrentUser() payload) {
    return this.cartService.create(payload.id);
  }

  // ~/cart
  @Get()
  @Roles(UserRole.Admin)
  @UseGuards(RolesAuthGuard)
  findAll() {
    return this.cartService.findAll();
  }

  // ~/cart/user-cart
  @Get('user-cart')
  @UseGuards(JwtAuthGuard)
  findOne(@CurrentUser() payload) {
    return this.cartService.findOne(payload.id);
  }

  // ~/cart/apply-coupon
  @Post('apply-coupon')
  @Roles(UserRole.User)
  @UseGuards(RolesAuthGuard)
  applyCoupon(@CurrentUser() payload, @Body() createCartDto: CreateCartDto) {
    return this.cartService.applyCoupon(payload.id, createCartDto);
  }
}
