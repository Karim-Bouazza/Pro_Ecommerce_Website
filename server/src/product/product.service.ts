import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CategoryService } from 'src/category/category.service';
import { SubCategoryService } from 'src/sub-category/sub-category.service';
import { BrandService } from 'src/brand/brand.service';

@Injectable()
export class ProductService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly categoryService: CategoryService,
    private readonly subCategoryService: SubCategoryService,
    private readonly brandService: BrandService,
  ) {}

  /**
   * Create a new product
   * @param createProductDto - The product data
   * @returns The created product
   */
  async create(createProductDto: CreateProductDto) {
    if (createProductDto.categoryId) {
      const category = await this.categoryService.findOne(
        createProductDto.categoryId,
      );
      if (!category) {
        throw new NotFoundException('Category not found');
      }
    }

    if (createProductDto.subCategoryId) {
      const subCategory = await this.subCategoryService.findOne(
        createProductDto.subCategoryId,
      );
      if (!subCategory) {
        throw new NotFoundException('SubCategory not found');
      }
    }

    if (createProductDto.brandId) {
      const brand = await this.brandService.findOne(createProductDto.brandId);
      if (!brand) {
        throw new NotFoundException('Brand not found');
      }
    }

    const product = await this.prisma.product.create({
      data: {
        ...createProductDto,
      },
    });

    return {
      status: 201,
      message: 'Product created successfully',
      data: product,
    };
  }

  /**
   * all products by admin
   * @returns status & message & data
   */
  async findAllByAdmin(
    pageNumber: number,
    productPerPage: number,
    product?: string,
    productsOrder?: string,
    quantityOrder?: string,
    quantityGte?: number,
    quantityLte?: number,
    soldOrder?: string,
    soldGte?: number,
    soldLte?: number,
    priceOrder?: string,
    priceGte?: number,
    priceLte?: number,
    priceAfterDiscountOrder?: string,
    priceAfterDiscountGte?: number,
    priceAfterDiscountLte?: number,
    ratingAverageOrder?: string,
    ratingAverageGte?: number,
    ratingAverageLte?: number,
    ratingQuantityOrder?: string,
    ratingQuantityGte?: number,
    ratingQuantityLte?: number,
  ) {
    const products = await this.prisma.product.findMany({
      skip: (pageNumber - 1) * productPerPage,
      take: productPerPage,
      orderBy: [
        { title: productsOrder === 'desc' ? 'desc' : 'asc' },
        { quantity: quantityOrder === 'desc' ? 'desc' : 'asc' },
        { sold: soldOrder === 'desc' ? 'desc' : 'asc' },
        { price: priceOrder === 'desc' ? 'desc' : 'asc' },
        { priceAfterDiscount: priceAfterDiscountOrder === 'desc' ? 'desc' : 'asc' },
        { ratingsAverage: ratingAverageOrder === 'desc' ? 'desc' : 'asc' },
        { ratingsQuantity: ratingQuantityOrder === 'desc' ? 'desc' : 'asc' },
      ],
      where: {
        title: { contains: product, mode: 'insensitive' },
        quantity: { gte: quantityGte, lte: quantityLte },
        sold: { gte: soldGte, lte: soldLte },
        price: { gte: priceGte, lte: priceLte },
        priceAfterDiscount: {
          gte: priceAfterDiscountGte,
          lte: priceAfterDiscountLte,
        },
        ratingsAverage: { gte: ratingAverageGte, lte: ratingAverageLte },
        ratingsQuantity: { gte: ratingQuantityGte, lte: ratingQuantityLte },
      },
      include: { category: true, subCategory: true, brand: true, reviews: true },
    });

    return {
      status: 200,
      message: 'Products found',
      data: products,
    };
  }

  /**
   * all products by user
   * @returns status & message & data
   */
  async findAllByUser(
    pageNumber: number,
    productPerPage: number,
    product?: string,
    productsOrder?: string,
    priceOrder?: string,
    priceGte?: number,
    priceLte?: number,
    ratingAverageOrder?: string,
    ratingAverageGte?: number,
    ratingAverageLte?: number,
    ratingQuantityOrder?: string,
    ratingQuantityGte?: number,
    ratingQuantityLte?: number,
  ) {
    const products = await this.prisma.product.findMany({
      skip: (pageNumber - 1) * productPerPage,
      take: productPerPage,
      orderBy: [
        { title: productsOrder === 'desc' ? 'desc' : 'asc' },
        { price: priceOrder === 'desc' ? 'desc' : 'asc' },
        { ratingsAverage: ratingAverageOrder === 'desc' ? 'desc' : 'asc' },
        { ratingsQuantity: ratingQuantityOrder === 'desc' ? 'desc' : 'asc' },
      ],
      where: {
        title: { contains: product, mode: 'insensitive' },
        price: { gte: priceGte, lte: priceLte },
        ratingsAverage: { gte: ratingAverageGte, lte: ratingAverageLte },
        ratingsQuantity: { gte: ratingQuantityGte, lte: ratingQuantityLte },
      },
      omit: { createdAt: true, updatedAt: true, quantity: true, sold: true },
      include: { category: true, subCategory: true, brand: true, reviews: true },
    });

    return {
      status: 200,
      message: 'Products found',
      data: products,
    };
  }

  /**
   * find by admin
   * @param id of product
   * @returns status & message & data
   */
  async findOneByAdmin(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { category: true, subCategory: true, brand: true, reviews: true },
    });
    if (!product) throw new NotFoundException('Product Not Found');

    return {
      status: 200,
      message: 'Product found',
      data: product,
    };
  }

  /**
   * find by user
   * @param id of product
   * @returns status & message & data
   */
  async findOneByUser(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      omit: { createdAt: true, updatedAt: true, quantity: true, sold: true },
      include: { category: true, subCategory: true, brand: true, reviews: true },
    });
    if (!product) throw new NotFoundException('Product Not Found');

    return {
      status: 200,
      message: 'Product found',
      data: product,
    };
  }

  /**
   * updated product by admin
   * @param id of product
   * @param updateProductDto - product data
   * @returns status & message & data
   */
  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException('Product Not Found');

    if (updateProductDto.categoryId) {
      const category = await this.categoryService.findOne(
        updateProductDto.categoryId,
      );
      if (!category) {
        throw new NotFoundException('Category not found');
      }
    }

    if (updateProductDto.subCategoryId) {
      const subCategory = await this.subCategoryService.findOne(
        updateProductDto.subCategoryId,
      );
      if (!subCategory) {
        throw new NotFoundException('SubCategory not found');
      }
    }

    if (updateProductDto.brandId) {
      const brand = await this.brandService.findOne(updateProductDto.brandId);
      if (!brand) {
        throw new NotFoundException('Brand not found');
      }
    }

    const productUpdated = await this.prisma.product.update({
      where: { id },
      data: updateProductDto,
    });

    return {
      status: 200,
      message: 'Product updated successfully',
      data: productUpdated,
    };
  }

  /**
   * delete product by admin
   * @param id of product
   * @returns status & message
   */
  async remove(id: number) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException('Product Not Found');

    await this.prisma.product.delete({ where: { id } });

    return {
      status: 200,
      message: 'Product deleted successfully',
    };
  }
}
