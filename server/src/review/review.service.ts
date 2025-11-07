import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { stat } from 'fs';
import { UserRole } from '@prisma/client';

@Injectable()
export class ReviewService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a review for a product
   * @param userId - ID of the user creating the review
   * @param productId - ID of the product being reviewed
   * @param createReviewDto - Data transfer object containing review details
   * @returns The created review
   */
  async create(
    userId: number,
    productId: number,
    createReviewDto: CreateReviewDto,
  ) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const exitUserReview = await this.prisma.review.findFirst({
      where: {
        userId,
        productId,
      },
    });
    if (exitUserReview) {
      throw new HttpException('User has already reviewed this product', 400);
    }

    const review = await this.prisma.review.create({
      data: {
        reviewText: createReviewDto.reviewText,
        rating: createReviewDto.rating,
        user: { connect: { id: userId } },
        product: { connect: { id: productId } },
      },
    });

    await this.prisma.product.update({
      where: { id: productId },
      data: {
        ratingsQuantity: (product.ratingsQuantity ?? 0) + 1,
        ratingsAverage:
          ((product.ratingsAverage ?? 0) * (product.ratingsQuantity ?? 0) +
            createReviewDto.rating) /
          ((product.ratingsQuantity ?? 0) + 1),
      },
    });

    return {
      status: 201,
      message: 'Review created successfully',
      data: review,
    };
  }

  /**
   * Get all reviews for a product
   * @param productId of the product
   * @returns status, message and array of reviews
   */
  async findAll(productId: number) {
    const reviews = await this.prisma.review.findMany({
      where: { productId },
      select: {
        id: true,
        reviewText: true,
        rating: true,
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    return {
      status: 200,
      message: 'Reviews retrieved successfully',
      data: reviews,
    };
  }

  /**
   * Get a review by userId
   * @param userId of the user
   * @returns data message and review
   */
  async findOne(userId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const review = await this.prisma.review.findMany({
      where: {
        userId,
      },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    return {
      status: 200,
      message: 'Review retrieved successfully',
      data: review,
    };
  }

  /**
   * update review by User
   * @param userId of user
   * @param productId of product
   * @param id of review
   * @param updateReviewDto of review
   * @returns data & status & message
   */
  async update(
    userId,
    productId: number,
    id: number,
    updateReviewDto: UpdateReviewDto,
  ) {
    const review = await this.prisma.review.findUnique({
      where: { id, userId, productId },
      include: { user: true, product: true },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    if (userId !== review.userId)
      throw new HttpException('Invalid Request', 404);

    const updatedReview = await this.prisma.review.update({
      where: {
        id: review.id,
      },
      data: {
        reviewText: updateReviewDto.reviewText,
        rating: updateReviewDto.rating,
      },
    });

    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (
      typeof updateReviewDto.rating === 'number' &&
      updateReviewDto.rating !== review.rating &&
      (product?.ratingsQuantity ?? 0) > 0
    ) {
      const count = product.ratingsQuantity ?? 0;
      const currentAvg = product.ratingsAverage ?? 0;
      const newAvg =
        (currentAvg * count - review.rating + updateReviewDto.rating) / count;

      await this.prisma.product.update({
        where: { id: productId },
        data: { ratingsAverage: newAvg },
      });
    }

    return {
      status: 200,
      message: 'Review updated successfully',
      data: updatedReview,
    };
  }

  /**
   * delete review by User
   * @param userId of User
   * @param productId of Product
   * @param id of review
   * @returns status & message
   */
  async remove(userId, productId: number, id: number) {
    const review = await this.prisma.review.findUnique({
      where: { id, userId, productId },
      include: { user: true, product: true },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    if (userId !== review.userId)
      throw new HttpException('Invalid Request', 404);

    await this.prisma.review.delete({
      where: { id: review.id },
    });

    return {
      status: 200,
      message: 'Review deleted successfully',
    };
  }
}
