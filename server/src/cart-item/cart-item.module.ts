import { Module } from '@nestjs/common';
import { CartItemService } from './cart-item.service';
import { CartItemController } from './cart-item.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersModule } from 'src/users/users.module';
import { CartModule } from 'src/cart/cart.module';
import { CouponModule } from 'src/coupon/coupon.module';

@Module({
  imports: [PrismaModule, UsersModule, CartModule],
  controllers: [CartItemController],
  providers: [CartItemService],
})
export class CartItemModule {}
