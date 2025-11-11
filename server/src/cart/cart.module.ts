import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersModule } from 'src/users/users.module';
import { CouponModule } from 'src/coupon/coupon.module';

@Module({
  imports: [PrismaModule, UsersModule, CouponModule],
  exports: [CartService],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
