import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { RolesAuthGuard } from 'src/auth/guards/roles.guard';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  // ~/review/product/:productId
  @Post('/product/:productId')
  @Roles(UserRole.User)
  @UseGuards(RolesAuthGuard)
  create(
    @CurrentUser() payload,
    @Param('productId', ParseIntPipe) productId: number,
    @Body() createReviewDto: CreateReviewDto,
  ) {
    return this.reviewService.create(payload.id, productId, createReviewDto);
  }

  // ~/review/product/:productId
  @Get('product/:productId')
  findAll(@Param('productId', ParseIntPipe) productId: number) {
    return this.reviewService.findAll(productId);
  }

  // ~/review/product/singleUserReview/:userId
  @Get('product/singleUserReview/:userId')
  @Roles(UserRole.Admin)
  @UseGuards(RolesAuthGuard)
  findOne(@Param('userId', ParseIntPipe) userId: number) {
    return this.reviewService.findOne(userId);
  }

  // ~/review/product/:productId/:id
  @Put('product/:productId/:id')
  @Roles(UserRole.User)
  @UseGuards(RolesAuthGuard)
  update(
    @CurrentUser() payload,
    @Param('productId', ParseIntPipe) productId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    return this.reviewService.update(
      payload.id,
      productId,
      id,
      updateReviewDto,
    );
  }

  // ~/review/product/remove/:productId/:id
  @Delete('product/remove/:productId/:id')
  @Roles(UserRole.User)
  @UseGuards(RolesAuthGuard)
  remove(
    @CurrentUser() payload,
    @Param('productId', ParseIntPipe) productId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.reviewService.remove(payload.id, productId, id);
  }
}
