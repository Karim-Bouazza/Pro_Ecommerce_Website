import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  ParseIntPipe,
  UseGuards,
  HttpException,
} from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { RolesAuthGuard } from 'src/auth/guards/roles.guard';

@Controller('coupon')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  // ~/coupon/create
  @Post('create')
  @Roles(UserRole.Admin)
  @UseGuards(RolesAuthGuard)
  create(@Body() createCouponDto: CreateCouponDto) {
    const isExpired = new Date(createCouponDto.expireDate) > new Date();
    if (!isExpired) throw new HttpException('Coupon is expired', 400);
    return this.couponService.create(createCouponDto);
  }

  // ~/coupon/coupons
  @Get('coupons')
  @Roles(UserRole.Admin)
  @UseGuards(RolesAuthGuard)
  findAll() {
    return this.couponService.findAll();
  }

  // ~/coupon/:id
  @Get(':id')
  @Roles(UserRole.Admin)
  @UseGuards(RolesAuthGuard)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.couponService.findOne(id);
  }

  // ~/coupon/:id
  @Put(':id')
  @Roles(UserRole.Admin)
  @UseGuards(RolesAuthGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCouponDto: UpdateCouponDto,
  ) {
    if (updateCouponDto.expireDate) {
      const isExpired = new Date(updateCouponDto.expireDate) > new Date();
      if (!isExpired) throw new HttpException('Coupon is expired', 400);
    }
    return this.couponService.update(id, updateCouponDto);
  }

  // ~/coupon/:id
  @Delete(':id')
  @Roles(UserRole.Admin)
  @UseGuards(RolesAuthGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.couponService.remove(id);
  }
}
