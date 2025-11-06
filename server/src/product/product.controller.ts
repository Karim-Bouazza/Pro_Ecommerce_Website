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
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { UserRole } from '@prisma/client';
import { RolesAuthGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // ~/product
  @Post()
  @Roles(UserRole.Admin)
  @UseGuards(RolesAuthGuard)
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  // ~/product/admin
  @Get('admin')
  @Roles(UserRole.Admin)
  @UseGuards(RolesAuthGuard)
  findAllByAdmin(
    @Query('pageNumber', ParseIntPipe) pageNumber: number,
    @Query('productPerPage', ParseIntPipe) productPerPage: number,
    @Query('product') product?: string,
    @Query('productsOrder') productsOrder?: string,
    @Query('quantityOrder') quantityOrder?: string,
    @Query('quantityGte') quantityGte?: number,
    @Query('quantityLte') quantityLte?: number,
    @Query('soldOrder') soldOrder?: string,
    @Query('soldGte') soldGte?: number,
    @Query('soldLte') soldLte?: number,
    @Query('priceOrder') priceOrder?: string,
    @Query('priceGte') priceGte?: number,
    @Query('priceLte') priceLte?: number,
    @Query('priceAfterDiscountOrder') priceAfterDiscountOrder?: string,
    @Query('priceAfterDiscountGte') priceAfterDiscountGte?: number,
    @Query('priceAfterDiscountLte') priceAfterDiscountLte?: number,
    @Query('ratingAverageOrder') ratingAverageOrder?: string,
    @Query('ratingAverageGte') ratingAverageGte?: number,
    @Query('ratingAverageLte') ratingAverageLte?: number,
    @Query('ratingQuantityOrder') ratingQuantityOrder?: string,
    @Query('ratingQuantityGte') ratingQuantityGte?: number,
    @Query('ratingQuantityLte') ratingQuantityLte?: number,
  ) {
    return this.productService.findAllByAdmin(
      pageNumber,
      productPerPage,
      product,
      productsOrder,
      quantityOrder,
      quantityGte,
      quantityLte,
      soldOrder,
      soldGte,
      soldLte,
      priceOrder,
      priceGte,
      priceLte,
      priceAfterDiscountOrder,
      priceAfterDiscountGte,
      priceAfterDiscountLte,
      ratingAverageOrder,
      ratingAverageGte,
      ratingAverageLte,
      ratingQuantityOrder,
      ratingQuantityGte,
      ratingQuantityLte,
    );
  }

  // ~/product
  @Get()
  findAllByUser(
    @Query('pageNumber', ParseIntPipe) pageNumber: number,
    @Query('productPerPage', ParseIntPipe) productPerPage: number,
    @Query('product') product?: string,
    @Query('productsOrder') productsOrder?: string,
    @Query('priceOrder') priceOrder?: string,
    @Query('priceGte', ParseIntPipe) priceGte?: number,
    @Query('priceLte', ParseIntPipe) priceLte?: number,
    @Query('ratingAverageOrder') ratingAverageOrder?: string,
    @Query('ratingAverageGte', ParseIntPipe) ratingAverageGte?: number,
    @Query('ratingAverageLte', ParseIntPipe) ratingAverageLte?: number,
    @Query('ratingQuantityOrder') ratingQuantityOrder?: string,
    @Query('ratingQuantityGte', ParseIntPipe) ratingQuantityGte?: number,
    @Query('ratingQuantityLte', ParseIntPipe) ratingQuantityLte?: number,
  ) {
    return this.productService.findAllByUser(
      pageNumber,
      productPerPage,
      product,
      productsOrder,
      priceOrder,
      priceGte,
      priceLte,
      ratingAverageOrder,
      ratingAverageGte,
      ratingAverageLte,
      ratingQuantityOrder,
      ratingQuantityGte,
      ratingQuantityLte,
    );
  }

  // ~/product/admin/:id
  @Get('admin/:id')
  @Roles(UserRole.Admin)
  @UseGuards(RolesAuthGuard)
  findOneByAdmin(@Param('id', ParseIntPipe) id: number) {
    return this.productService.findOneByAdmin(id);
  }

  // ~/product/:id
  @Get(':id')
  findOneByUser(@Param('id', ParseIntPipe) id: number) {
    return this.productService.findOneByUser(id);
  }

  // ~/product/:id
  @Put(':id')
  @Roles(UserRole.Admin)
  @UseGuards(RolesAuthGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productService.update(id, updateProductDto);
  }

  // ~/product/:id
  @Delete(':id')
  @Roles(UserRole.Admin)
  @UseGuards(RolesAuthGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productService.remove(id);
  }
}
