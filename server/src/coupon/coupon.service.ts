import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CouponService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * create coupon by admin
   * @param createCouponDto name & expireDate & discount
   * @returns status & message & data
   */
  async create(createCouponDto: CreateCouponDto) {
    const { name } = createCouponDto;

    const coupon = await this.prisma.coupon.findFirst({ where: { name } });
    if (coupon)
      throw new HttpException(
        `You have already coupon with name: ${name}`,
        400,
      );

    const newCoupon = await this.prisma.coupon.create({
      data: createCouponDto,
    });
    return {
      status: 200,
      message: 'Coupon created successfully',
      data: newCoupon,
    };
  }

  /**
   * get coupons by admin
   * @returns status & message & data
   */
  async findAll() {
    const coupons = await this.prisma.coupon.findMany({
      omit: { createdAt: true, updatedAt: true },
    });

    return {
      status: 200,
      message: 'Coupons found',
      data: coupons,
    };
  }

  /**
   * get coupon by admin
   * @param id of coupon
   * @returns status & message & data
   */
  async findOne(id: number) {
    const coupon = await this.prisma.coupon.findUnique({
      where: { id },
    });
    if (!coupon) throw new NotFoundException('Coupon Not Found');

    return {
      status: 200,
      message: 'Coupon found',
      data: coupon,
    };
  }

  /**
   * update coupon by admin
   * @param id of coupon
   * @param updateCouponDto name & expireDate & discount
   * @returns status & message & data
   */
  async update(id: number, updateCouponDto: UpdateCouponDto) {
    const coupon = await this.prisma.coupon.findUnique({
      where: { id },
    });
    if (!coupon) throw new NotFoundException('Coupon Not Found');

    if (updateCouponDto.name) {
      const existingCoupon = await this.prisma.coupon.findFirst({
        where: { name: updateCouponDto.name },
      });
      if (existingCoupon && existingCoupon.id !== id) {
        throw new HttpException(
          `You have already coupon with name: ${updateCouponDto.name}`,
          400,
        );
      }
    }

    const couponUpdated = await this.prisma.coupon.update({
      where: { id },
      data: updateCouponDto,
    });

    return {
      status: 200,
      message: 'Coupon updated successfully',
      data: couponUpdated,
    };
  }

  /**
   * delete coupon by admin
   * @param id of coupon
   * @returns status & message
   */
  async remove(id: number) {
    const coupon = await this.prisma.coupon.findUnique({
      where: { id },
    });
    if (!coupon) throw new NotFoundException('Coupon Not Found');

    await this.prisma.coupon.delete({
      where: { id },
    });

    return {
      status: 200,
      message: 'Coupon deleted successfully',
    };
  }
}
