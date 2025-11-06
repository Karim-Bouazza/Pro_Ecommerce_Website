import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersModule } from 'src/users/users.module';
import { CategoryModule } from 'src/category/category.module';
import { SubCategoryModule } from 'src/sub-category/sub-category.module';
import { BrandModule } from 'src/brand/brand.module';

@Module({
  imports: [PrismaModule, UsersModule, CategoryModule, SubCategoryModule, BrandModule],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
