import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Put,
} from '@nestjs/common';
import { CartItemService } from './cart-item.service';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { RolesAuthGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('cart-item')
export class CartItemController {
  constructor(private readonly cartItemService: CartItemService) {}

  // ~/cart-item/create/:productId
  @Post('create/:productId')
  @Roles(UserRole.User)
  @UseGuards(RolesAuthGuard)
  create(
    @CurrentUser() payload,
    @Body() createCartItemDto: CreateCartItemDto,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    return this.cartItemService.create(
      payload.id,
      productId,
      createCartItemDto,
    );
  }

  // ~/cart-item/update/:cartItemId
  @Put('update/:cartItemId')
  @Roles(UserRole.User)
  @UseGuards(RolesAuthGuard)
  update(
    @Param('cartItemId', ParseIntPipe) cartItemId: number,
    @CurrentUser() payload,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ) {
    return this.cartItemService.update(
      cartItemId,
      payload.id,
      updateCartItemDto,
    );
  }

  // ~/cart-item/delete/:cartItemId
  @Roles(UserRole.User)
  @UseGuards(RolesAuthGuard)
  @Delete('delete/:cartItemId')
  remove(
    @Param('cartItemId', ParseIntPipe) cartItemId: number,
    @CurrentUser() payload,
  ) {
    return this.cartItemService.remove(cartItemId, payload.id);
  }
}
