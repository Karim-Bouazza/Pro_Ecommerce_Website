import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CartItemService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a new cart item
   * @param userId of user
   * @param cartId of cart
   * @param productId of product
   * @param createCartItemDto quantity & colors
   * @returns created cart item
   */
  async create(
    userId: number,
    productId: number,
    createCartItemDto: CreateCartItemDto,
  ) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const cart = await this.prisma.cart.findFirst({ where: { userId } });
    if (!cart) throw new NotFoundException('Cart not found');

    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) throw new NotFoundException('Product not found');

    const existing = await this.prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId },
    });

    if (existing) throw new ConflictException('Product already in cart');

    const cartItem = await this.prisma.cartItem.create({
      data: {
        ...createCartItemDto,
        cartId: cart.id,
        productId,
        userId,
      },
      include: { product: true },
    });

    const price =
      product.priceAfterDiscount === 0 || product.priceAfterDiscount === null
        ? cartItem.quantity * product.price
        : product.priceAfterDiscount * cartItem.quantity;

    const cartUpdate = await this.prisma.cart.update({
      where: { id: cart.id },
      data: {
        totalPrice: {
          increment: price,
        },
      },
    });

    return {
      status: 200,
      message: 'Cart-Item created successfully',
      data: cartItem,
    };
  }

  /**
   * update a cart item
   * @param cartItemId of Cart-Item
   * @param cartId of Cart
   * @param updateCartItemDto quantity & colors
   * @returns status & message & data
   */
  async update(
    cartItemId: number,
    userId: number,
    updateCartItemDto: UpdateCartItemDto,
  ) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const cart = await this.prisma.cart.findFirst({ where: { userId } });
    if (!cart) throw new NotFoundException('Cart not found');

    if (cart.userId !== userId) {
      throw new ForbiddenException('You are not allowed to modify this cart');
    }

    const cartItem = await this.prisma.cartItem.findUnique({
      where: { id: cartItemId },
    });
    if (!cartItem) throw new NotFoundException('Cart-Item not found');

    if (cartItem.userId !== userId) {
      throw new ForbiddenException(
        'You are not allowed to modify this cart item',
      );
    }

    const cartItemUpdated = await this.prisma.cartItem.update({
      where: { id: cartItemId },
      data: {
        ...updateCartItemDto,
      },
      include: { product: true },
    });

    const priceDifference =
      (cartItemUpdated.quantity - cartItem.quantity) *
      (cartItemUpdated.product.priceAfterDiscount === 0 ||
      cartItemUpdated.product.priceAfterDiscount === null
        ? cartItemUpdated.product.price
        : cartItemUpdated.product.priceAfterDiscount);

    await this.prisma.cart.update({
      where: { id: cart.id },
      data: {
        totalPrice: { increment: priceDifference },
      },
    });

    return {
      status: 200,
      message: 'Cart-Item updated successfully',
      data: cartItemUpdated,
    };
  }

  /**
   * remove a cart item
   * @param cartItemId of cart-item
   * @param userId of user
   * @returns status & data
   */
  async remove(cartItemId: number, userId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const cart = await this.prisma.cart.findFirst({ where: { userId } });
    if (!cart) throw new NotFoundException('Cart not found');

    if (cart.userId !== userId) {
      throw new ForbiddenException('You are not allowed to modify this cart');
    }

    const cartItem = await this.prisma.cartItem.findUnique({
      where: { id: cartItemId },
      include: { product: true },
    });
    if (!cartItem) throw new NotFoundException('Cart-Item not found');

    if (cartItem.userId !== userId) {
      throw new ForbiddenException(
        'You are not allowed to modify this cart item',
      );
    }

    const cartItemDeleted = await this.prisma.cartItem.delete({
      where: { id: cartItemId },
      include: { product: true },
    });

    const priceToSubtract =
      cartItem.product.priceAfterDiscount === 0 ||
      cartItem.product.priceAfterDiscount === null
        ? cartItem.quantity * cartItem.product.price
        : cartItem.quantity * cartItem.product.priceAfterDiscount;

    await this.prisma.cart.update({
      where: { id: cart.id },
      data: {
        totalPrice: { decrement: priceToSubtract },
      },
    });

    return {
      status: 200,
      message: 'Cart-Item deleted successfully',
    };
  }
}
