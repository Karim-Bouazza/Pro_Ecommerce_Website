import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserRole } from '@prisma/client';
import { CouponService } from 'src/coupon/coupon.service';
import { CreateCartDto } from './dto/create-cart.dto';

@Injectable()
export class CartService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly couponService: CouponService,
  ) {}

  /**
   * create one time cart for user
   * @param userId of user
   * @returns status & message & data
   */
  async create(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const existingCart = await this.prisma.cart.findFirst({
      where: { userId },
    });
    if (existingCart) throw new HttpException('You have already cart', 409);

    const cart = await this.prisma.cart.create({
      data: {
        userId,
      },
    });

    return {
      status: 200,
      message: 'Cart created successfully',
      data: cart,
    };
  }

  /**
   * find all carts of users by admin
   * @returns status & message & data
   */
  async findAll() {
    const carts = await this.prisma.cart.findMany({
      include: { cartItems: true },
    });
    const cartsWithProducts = await this.prisma.cart.findMany({
      include: { cartItems: { include: { product: true } } },
    });
    return {
      status: 200,
      message: 'Carts found',
      data: cartsWithProducts,
    };
  }

  /**
   * find cart of user by himself or admin
   * @param userId of user
   * @returns status & message & data
   */
  async findOne(userId: number) {
    const cartUser = await this.prisma.cart.findFirst({
      where: { userId },
      include: { cartItems: { include: { product: true } } },
    });
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (userId !== cartUser?.userId || user?.role === UserRole.Admin) {
      throw new HttpException('invalid data', 404);
    }

    return {
      status: 200,
      message: 'Cart found',
      data: cartUser,
    };
  }

  /**
   * apply coupon to cart of user
   * @param userId of user
   * @param createCartDto couponName
   * @returns status & message & data
   */
  async applyCoupon(userId: number, createCartDto: CreateCartDto) {
    const { couponName } = createCartDto;
    const coupon = await this.prisma.coupon.findFirst({
      where: { name: couponName },
    });
    if (!coupon) throw new NotFoundException('Coupon Not Found');

    const isExpired = new Date(coupon.expireDate) <= new Date();
    if (isExpired) throw new HttpException('Coupon is expired', 400);

    const cart = await this.findOne(userId);

    if (!cart.data.totalPrice || isNaN(cart.data.totalPrice)) {
      throw new HttpException('Invalid cart total price', 400);
    }

    if (cart.data.totalPrice < coupon.discount) {
      throw new HttpException('Coupon discount exceeds cart total price', 400);
    }

    if (cart.data.totalPrice && !isNaN(cart.data.totalPrice)) {
      cart.data.totalPriceAfterDiscount =
        cart.data.totalPrice - coupon.discount;
    }

    const cartUpdated = await this.prisma.cart.update({
      where: { id: cart.data.id },
      data: {
        totalPriceAfterDiscount: cart.data.totalPriceAfterDiscount,
        couponId: coupon.id,
      },
    });

    return {
      status: 200,
      message: 'Coupon applied successfully',
      data: cartUpdated,
    };
  }
}
