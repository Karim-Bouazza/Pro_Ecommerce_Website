import { Module } from '@nestjs/common';
import { AdminsModule } from './admins/admins.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { ResetPasswordModule } from './reset_password/reset_password.module';
import { CategoryModule } from './category/category.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { SubCategoryModule } from './sub-category/sub-category.module';
import { BrandModule } from './brand/brand.module';
import { CouponModule } from './coupon/coupon.module';
import { SuppliersModule } from './suppliers/suppliers.module';
import { RequestModule } from './request/request.module';
import { TexModule } from './tex/tex.module';
import { ProductModule } from './product/product.module';
import { ReviewModule } from './review/review.module';

@Module({
  imports: [AdminsModule, UsersModule, AuthModule, MailModule, ResetPasswordModule, CategoryModule, CloudinaryModule, SubCategoryModule, BrandModule, CouponModule, SuppliersModule, RequestModule, TexModule, ProductModule, ReviewModule],
})
export class AppModule {}
